import { expect } from "chai";
import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";

const SCOPE = {
  VotePresident: 1 << 0,
  AnnualDues: 1 << 1,
  Slashing: 1 << 2,
  DelegatedVote: 1 << 3,
  FollowAccount: 1 << 4,
  NormCommit: 1 << 5,
  DisputeResolverAssign: 1 << 6,
  AttendanceCommit: 1 << 7,
};

const POWER = {
  TreasurySmallSpend: 0,
  TreasuryLargeSpend: 1,
  NormsAmendment: 2,
  EventScheduler: 3,
  DisputeResolve: 4,
  MemberOnboard: 5,
  ElectionScheduler: 6,
  CensusAdmin: 7,
};

const VERDICT = { Pending: 0, Dismissed: 1, Slash: 2, Eject: 3 };

const ALL_REQUIRED =
  SCOPE.VotePresident |
  SCOPE.AnnualDues |
  SCOPE.Slashing |
  SCOPE.NormCommit;

const ALL_GRANTED = ALL_REQUIRED | SCOPE.DelegatedVote | SCOPE.FollowAccount;

async function deployAll() {
  const [admin, alice, bob, carol, dave] = await ethers.getSigners();

  const MockUSDC = await ethers.getContractFactory("MockUSDC");
  const usdc = await MockUSDC.deploy();
  await usdc.waitForDeployment();
  for (const u of [alice, bob, carol, dave]) {
    await usdc.mint(u.address, 10_000n * 10n ** 6n);
  }

  const PR = await ethers.getContractFactory("PartyRegistry");
  const partyRegistry = await PR.deploy();
  await partyRegistry.waitForDeployment();

  const NR = await ethers.getContractFactory("NormsRegistry");
  const norms = await NR.deploy(await partyRegistry.getAddress());
  await norms.waitForDeployment();

  const MN = await ethers.getContractFactory("MembershipNFT");
  const membership = await MN.deploy(await partyRegistry.getAddress());
  await membership.waitForDeployment();

  const FR = await ethers.getContractFactory("Franchise");
  const franchise = await FR.deploy(
    await partyRegistry.getAddress(),
    await membership.getAddress(),
    await norms.getAddress(),
    await usdc.getAddress()
  );
  await franchise.waitForDeployment();
  await membership.setFranchise(await franchise.getAddress());

  const CB = await ethers.getContractFactory("Cabinet");
  const cabinet = await CB.deploy(await partyRegistry.getAddress());
  await cabinet.waitForDeployment();

  const DR = await ethers.getContractFactory("DisputeResolver");
  const disputeResolver = await DR.deploy(
    await partyRegistry.getAddress(),
    await cabinet.getAddress(),
    await membership.getAddress(),
    await norms.getAddress()
  );
  await disputeResolver.waitForDeployment();
  await franchise.setDisputeResolver(await disputeResolver.getAddress());

  const IV = await ethers.getContractFactory("IVotedNFT");
  const ivotedNFT = await IV.deploy();
  await ivotedNFT.waitForDeployment();

  const VT = await ethers.getContractFactory("Voting");
  const voting = await VT.deploy(
    await partyRegistry.getAddress(),
    await membership.getAddress(),
    await franchise.getAddress()
  );
  await voting.waitForDeployment();
  await voting.setIVotedNFT(await ivotedNFT.getAddress());
  await ivotedNFT.setMinter(await voting.getAddress());

  const EL = await ethers.getContractFactory("Election");
  const election = await EL.deploy(
    await partyRegistry.getAddress(),
    await membership.getAddress(),
    await cabinet.getAddress()
  );
  await election.waitForDeployment();
  await partyRegistry.setElectionContract(await election.getAddress());

  const TR = await ethers.getContractFactory("Treasury");
  const treasury = await TR.deploy(
    await partyRegistry.getAddress(),
    await membership.getAddress(),
    await cabinet.getAddress(),
    await voting.getAddress(),
    await usdc.getAddress()
  );
  await treasury.waitForDeployment();
  await voting.setAuthorizedCaller(await treasury.getAddress(), true);

  const CN = await ethers.getContractFactory("Census");
  const census = await CN.deploy(
    await partyRegistry.getAddress(),
    await membership.getAddress(),
    await cabinet.getAddress()
  );
  await census.waitForDeployment();

  const AG = await ethers.getContractFactory("AccessGate");
  const accessGate = await AG.deploy(
    await partyRegistry.getAddress(),
    await membership.getAddress(),
    await cabinet.getAddress(),
    await census.getAddress()
  );
  await accessGate.waitForDeployment();

  return {
    admin, alice, bob, carol, dave,
    usdc, partyRegistry, norms, membership, franchise, cabinet,
    disputeResolver, ivotedNFT, voting, election, treasury, census, accessGate,
  };
}

describe("Technodemocracy — full flow", function () {
  it("universal candidacy: any wallet can found a party", async () => {
    const { partyRegistry, alice, bob } = await deployAll();
    await partyRegistry.connect(alice).createParty("Don't Die", "Longevity", "ipfs://x");
    await partyRegistry.connect(bob).createParty("Mars Party", "Multiplanetary", "ipfs://y");

    expect(await partyRegistry.partyCount()).to.equal(3n);
    expect(await partyRegistry.partyPresident(1)).to.equal(alice.address);
    expect(await partyRegistry.partyPresident(2)).to.equal(bob.address);
  });

  it("franchise: register, grant, debit, revoke", async () => {
    const { partyRegistry, norms, franchise, membership, usdc, alice, bob } =
      await deployAll();

    await partyRegistry.connect(alice).createParty("Don't Die", "L", "ipfs://x");
    const partyId = 1n;

    const normsHash = ethers.keccak256(ethers.toUtf8Bytes("v1 norms"));
    await norms.connect(alice).publishNorms(partyId, "ipfs://n", normsHash);

    await franchise.connect(alice).registerFranchise(
      partyId, 100n * 10n ** 6n, 50n * 10n ** 6n, 1000, ALL_REQUIRED, SCOPE.DelegatedVote | SCOPE.FollowAccount
    );

    await usdc.connect(bob).approve(await franchise.getAddress(), 1000n * 10n ** 6n);
    await franchise.connect(bob).grantFranchise(partyId, ALL_GRANTED);

    expect(await franchise.isFranchiseGranted(partyId, bob.address)).to.equal(true);
    expect(await membership.isMember(partyId, bob.address)).to.equal(true);
    expect(await franchise.getDelegatedVoteBps(partyId, bob.address)).to.equal(1000);

    await franchise.connect(bob).revokeFranchise(partyId);
    expect(await franchise.isFranchiseGranted(partyId, bob.address)).to.equal(false);
    expect(await membership.isMember(partyId, bob.address)).to.equal(false);
  });

  it("cabinet: digital delegation with cryptographically scoped powers", async () => {
    const { partyRegistry, cabinet, alice, bob, carol } = await deployAll();
    await partyRegistry.connect(alice).createParty("Mars", "x", "ipfs://y");

    await cabinet.connect(alice).appoint(1, bob.address, "Treasurer", 1 << POWER.TreasurySmallSpend);
    await cabinet.connect(alice).appoint(1, carol.address, "VP",
      (1 << POWER.TreasuryLargeSpend) | (1 << POWER.DisputeResolve));

    expect(await cabinet.hasPower(1, alice.address, POWER.TreasurySmallSpend)).to.equal(true);
    expect(await cabinet.hasPower(1, bob.address, POWER.TreasurySmallSpend)).to.equal(true);
    expect(await cabinet.hasPower(1, bob.address, POWER.DisputeResolve)).to.equal(false);
    expect(await cabinet.hasPower(1, carol.address, POWER.DisputeResolve)).to.equal(true);
  });

  it("voting: streaming votes mint I Voted NFTs", async () => {
    const { partyRegistry, norms, franchise, voting, ivotedNFT, usdc, alice, bob } =
      await deployAll();

    await partyRegistry.connect(alice).createParty("Don't Die", "L", "ipfs://x");
    await norms.connect(alice).publishNorms(1, "ipfs://n", ethers.keccak256(ethers.toUtf8Bytes("v1")));
    await franchise.connect(alice).registerFranchise(1, 100n * 10n ** 6n, 50n * 10n ** 6n, 0, ALL_REQUIRED, 0);

    for (const u of [alice, bob]) {
      await usdc.connect(u).approve(await franchise.getAddress(), 1000n * 10n ** 6n);
      await franchise.connect(u).grantFranchise(1, ALL_REQUIRED);
    }

    await voting.connect(bob).createProposal(1, "Fund Hackathon", "ipfs://desc", 7 * 24 * 60 * 60);
    await voting.connect(alice).castVote(1, true);
    await voting.connect(bob).castVote(1, true);

    const result = await voting.getResult(1);
    expect(result.yesWeight).to.equal(20000n);
    expect(await ivotedNFT.balanceOf(alice.address)).to.equal(1n);
    expect(await ivotedNFT.balanceOf(bob.address)).to.equal(1n);
  });

  it("I Voted NFT is soulbound", async () => {
    const { partyRegistry, norms, franchise, voting, ivotedNFT, usdc, alice, carol } =
      await deployAll();

    await partyRegistry.connect(alice).createParty("X", "x", "ipfs://x");
    await norms.connect(alice).publishNorms(1, "ipfs://n", ethers.keccak256(ethers.toUtf8Bytes("v1")));
    await franchise.connect(alice).registerFranchise(1, 100n * 10n ** 6n, 50n * 10n ** 6n, 0, ALL_REQUIRED, 0);

    await usdc.connect(alice).approve(await franchise.getAddress(), 1000n * 10n ** 6n);
    await franchise.connect(alice).grantFranchise(1, ALL_REQUIRED);

    await voting.connect(alice).createProposal(1, "T", "ipfs://d", 86400);
    await voting.connect(alice).castVote(1, true);

    await expect(
      ivotedNFT.connect(alice).transferFrom(alice.address, carol.address, 1)
    ).to.be.revertedWithCustomError(ivotedNFT, "Soulbound");
  });

  it("treasury: small-spend by cabinet treasurer", async () => {
    const { partyRegistry, norms, franchise, cabinet, treasury, usdc, alice, bob, carol, dave } =
      await deployAll();

    await partyRegistry.connect(alice).createParty("Mars", "x", "ipfs://x");
    await norms.connect(alice).publishNorms(1, "ipfs://n", ethers.keccak256(ethers.toUtf8Bytes("v1")));
    await franchise.connect(alice).registerFranchise(1, 100n * 10n ** 6n, 50n * 10n ** 6n, 0, ALL_REQUIRED, 0);

    await cabinet.connect(alice).appoint(1, bob.address, "Treasurer", 1 << POWER.TreasurySmallSpend);
    await treasury.connect(alice).setSmallSpendCap(1, 500n * 10n ** 6n);

    await usdc.connect(carol).approve(await treasury.getAddress(), 1000n * 10n ** 6n);
    await treasury.connect(carol).deposit(1, 1000n * 10n ** 6n);

    const before = await usdc.balanceOf(dave.address);
    await treasury.connect(bob).smallSpend(1, dave.address, 200n * 10n ** 6n, "Workshop");
    const after = await usdc.balanceOf(dave.address);
    expect(after - before).to.equal(200n * 10n ** 6n);
    expect(await treasury.balanceOf(1)).to.equal(800n * 10n ** 6n);

    await expect(
      treasury.connect(bob).smallSpend(1, dave.address, 600n * 10n ** 6n, "Too big")
    ).to.be.revertedWithCustomError(treasury, "AmountAboveSmallSpend");
  });

  it("dispute → verdict → slash (provably bounded)", async () => {
    const { partyRegistry, norms, franchise, disputeResolver, usdc, alice, bob } =
      await deployAll();

    await partyRegistry.connect(alice).createParty("Don't Die", "x", "ipfs://x");
    const normsHash = ethers.keccak256(ethers.toUtf8Bytes("no closed weights"));
    await norms.connect(alice).publishNorms(1, "ipfs://n", normsHash);
    await franchise.connect(alice).registerFranchise(1, 100n * 10n ** 6n, 50n * 10n ** 6n, 0, ALL_REQUIRED, 0);

    for (const u of [alice, bob]) {
      await usdc.connect(u).approve(await franchise.getAddress(), 1000n * 10n ** 6n);
      await franchise.connect(u).grantFranchise(1, ALL_REQUIRED);
    }

    await disputeResolver.connect(alice).file(1, bob.address, 1, normsHash, "ipfs://evidence");
    await disputeResolver.connect(alice).resolve(1, VERDICT.Slash, "ipfs://verdict");

    await usdc.connect(bob).approve(await franchise.getAddress(), 50n * 10n ** 6n);
    await franchise.connect(alice).slashMember(1, bob.address, 30n * 10n ** 6n, 1, 1, normsHash);

    await expect(
      franchise.connect(alice).slashMember(1, bob.address, 30n * 10n ** 6n, 1, 1, normsHash)
    ).to.be.revertedWithCustomError(franchise, "SlashCapExceeded");
  });

  it("cannot slash without resolved dispute", async () => {
    const { partyRegistry, norms, franchise, usdc, alice, bob } = await deployAll();
    await partyRegistry.connect(alice).createParty("X", "x", "ipfs://x");
    const h = ethers.keccak256(ethers.toUtf8Bytes("v1"));
    await norms.connect(alice).publishNorms(1, "ipfs://n", h);
    await franchise.connect(alice).registerFranchise(1, 0, 100n * 10n ** 6n, 0, ALL_REQUIRED, 0);

    await usdc.connect(bob).approve(await franchise.getAddress(), 1000n * 10n ** 6n);
    await franchise.connect(bob).grantFranchise(1, ALL_REQUIRED);
    await usdc.connect(bob).approve(await franchise.getAddress(), 100n * 10n ** 6n);

    await expect(
      franchise.connect(alice).slashMember(1, bob.address, 10n * 10n ** 6n, 1, 1, h)
    ).to.be.reverted;
  });

  it("election: scheduled by cabinet, candidate wins, takes presidency", async () => {
    const { partyRegistry, norms, franchise, cabinet, election, usdc, alice, bob, carol } =
      await deployAll();

    await partyRegistry.connect(alice).createParty("X", "x", "ipfs://x");
    const h = ethers.keccak256(ethers.toUtf8Bytes("v1"));
    await norms.connect(alice).publishNorms(1, "ipfs://n", h);
    await franchise.connect(alice).registerFranchise(1, 0, 0, 0, ALL_REQUIRED, 0);

    for (const u of [alice, bob, carol]) {
      await usdc.connect(u).approve(await franchise.getAddress(), 1000n * 10n ** 6n);
      await franchise.connect(u).grantFranchise(1, ALL_REQUIRED);
    }

    await cabinet.connect(alice).appoint(1, bob.address, "Coordinator", 1 << POWER.ElectionScheduler);

    await election.connect(bob).scheduleElection(1, 86400);
    await election.connect(bob).declareCandidacy(1);
    await election.connect(carol).declareCandidacy(1);

    await election.connect(alice).castElectionVote(1, bob.address);
    await election.connect(bob).castElectionVote(1, bob.address);
    await election.connect(carol).castElectionVote(1, carol.address);

    await time.increase(86401);
    await election.finalize(1);

    expect(await partyRegistry.partyPresident(1)).to.equal(bob.address);
  });

  it("census + access gate: stamp grants door access", async () => {
    const { partyRegistry, norms, franchise, census, accessGate, usdc, alice, bob } =
      await deployAll();

    await partyRegistry.connect(alice).createParty("X", "x", "ipfs://x");
    const h = ethers.keccak256(ethers.toUtf8Bytes("v1"));
    await norms.connect(alice).publishNorms(1, "ipfs://n", h);
    await franchise.connect(alice).registerFranchise(1, 0, 0, 0, ALL_REQUIRED, 0);

    await usdc.connect(bob).approve(await franchise.getAddress(), 1000n * 10n ** 6n);
    await franchise.connect(bob).grantFranchise(1, ALL_REQUIRED);

    const start = (await time.latest()) + 10;
    const end = start + 86400;
    await census.connect(alice).createCensus(1, "Spring 2026", "ipfs://stamp", start, end);
    await time.increaseTo(start + 1);
    const censusId = (await census.censusCount()) - 1n;
    await census.connect(bob).attest(censusId, ethers.keccak256(ethers.toUtf8Bytes("loc-proof")));

    await accessGate.connect(alice).createGate("Founders Lounge", 1, true, false, 0, 1);
    const gateId = (await accessGate.gateCount()) - 1n;

    expect(await accessGate.canAccess(gateId, bob.address)).to.equal(true);
    expect(await accessGate.canAccess(gateId, alice.address)).to.equal(false);
  });
});
