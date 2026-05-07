import { ethers, network } from "hardhat";
import * as fs from "fs";
import * as path from "path";

const BASE_MAINNET_USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

const SEED_PARTIES = [
  {
    name: "Don't Die Party",
    description:
      "Founded by Bryan Johnson. Optimize the body, defeat aging, refuse death.",
    metadataCID: "ipfs://placeholder-dont-die",
  },
  {
    name: "Mars Party",
    description:
      "Make humanity multiplanetary. Members commit time and capital to advancing space technology.",
    metadataCID: "ipfs://placeholder-mars",
  },
  {
    name: "Open-Source AI Party",
    description:
      "Models should be open. Weights should be free. Members fund OSS model training.",
    metadataCID: "ipfs://placeholder-oss-ai",
  },
  {
    name: "Network State Party",
    description:
      "Build the cloud-first, land-second nation. Coordinate offline meetups, vote in censorship-resistant elections.",
    metadataCID: "ipfs://placeholder-network-state",
  },
];

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log(
    "Balance:",
    ethers.formatEther(await ethers.provider.getBalance(deployer.address)),
    "ETH\n"
  );

  let usdc: string;
  if (network.name === "base") {
    usdc = BASE_MAINNET_USDC;
    console.log("USDC: real on Base mainnet:", usdc);
  } else {
    const Mock = await ethers.getContractFactory("MockUSDC");
    const m = await Mock.deploy();
    await m.waitForDeployment();
    usdc = await m.getAddress();
    console.log("USDC: MockUSDC deployed to", usdc);
  }

  const PR = await ethers.getContractFactory("PartyRegistry");
  const pr = await PR.deploy();
  await pr.waitForDeployment();
  const partyRegistry = await pr.getAddress();
  console.log("PartyRegistry:", partyRegistry);

  const NR = await ethers.getContractFactory("NormsRegistry");
  const nr = await NR.deploy(partyRegistry);
  await nr.waitForDeployment();
  const normsRegistry = await nr.getAddress();
  console.log("NormsRegistry:", normsRegistry);

  const MN = await ethers.getContractFactory("MembershipNFT");
  const mn = await MN.deploy(partyRegistry);
  await mn.waitForDeployment();
  const membershipNFT = await mn.getAddress();
  console.log("MembershipNFT:", membershipNFT);

  const FR = await ethers.getContractFactory("Franchise");
  const fr = await FR.deploy(partyRegistry, membershipNFT, normsRegistry, usdc);
  await fr.waitForDeployment();
  const franchise = await fr.getAddress();
  console.log("Franchise:", franchise);

  await (await mn.setFranchise(franchise)).wait();

  const CB = await ethers.getContractFactory("Cabinet");
  const cb = await CB.deploy(partyRegistry);
  await cb.waitForDeployment();
  const cabinet = await cb.getAddress();
  console.log("Cabinet:", cabinet);

  const DR = await ethers.getContractFactory("DisputeResolver");
  const dr = await DR.deploy(partyRegistry, cabinet, membershipNFT, normsRegistry);
  await dr.waitForDeployment();
  const disputeResolver = await dr.getAddress();
  console.log("DisputeResolver:", disputeResolver);

  await (await fr.setDisputeResolver(disputeResolver)).wait();

  const IV = await ethers.getContractFactory("IVotedNFT");
  const iv = await IV.deploy();
  await iv.waitForDeployment();
  const ivotedNFT = await iv.getAddress();
  console.log("IVotedNFT:", ivotedNFT);

  const VT = await ethers.getContractFactory("Voting");
  const vt = await VT.deploy(partyRegistry, membershipNFT, franchise);
  await vt.waitForDeployment();
  const voting = await vt.getAddress();
  console.log("Voting:", voting);

  await (await vt.setIVotedNFT(ivotedNFT)).wait();
  await (await iv.setMinter(voting)).wait();

  const EL = await ethers.getContractFactory("Election");
  const el = await EL.deploy(partyRegistry, membershipNFT, cabinet);
  await el.waitForDeployment();
  const election = await el.getAddress();
  console.log("Election:", election);

  await (await pr.setElectionContract(election)).wait();

  const TR = await ethers.getContractFactory("Treasury");
  const tr = await TR.deploy(partyRegistry, membershipNFT, cabinet, voting, usdc);
  await tr.waitForDeployment();
  const treasury = await tr.getAddress();
  console.log("Treasury:", treasury);

  await (await vt.setAuthorizedCaller(treasury, true)).wait();

  const CN = await ethers.getContractFactory("Census");
  const cn = await CN.deploy(partyRegistry, membershipNFT, cabinet);
  await cn.waitForDeployment();
  const census = await cn.getAddress();
  console.log("Census:", census);

  const AG = await ethers.getContractFactory("AccessGate");
  const ag = await AG.deploy(partyRegistry, membershipNFT, cabinet, census);
  await ag.waitForDeployment();
  const accessGate = await ag.getAddress();
  console.log("AccessGate:", accessGate);

  console.log("\nSeeding Balaji's example parties...");
  for (const p of SEED_PARTIES) {
    const tx = await pr.createParty(p.name, p.description, p.metadataCID);
    await tx.wait();
    console.log(`  Founded: ${p.name}`);
  }

  const addresses = {
    network: network.name,
    chainId: (await ethers.provider.getNetwork()).chainId.toString(),
    deployer: deployer.address,
    contracts: {
      usdc, partyRegistry, normsRegistry, membershipNFT, franchise, cabinet,
      disputeResolver, ivotedNFT, voting, election, treasury, census, accessGate,
    },
    deployedAt: new Date().toISOString(),
  };

  const out = path.join(__dirname, "..", "deployed-addresses.json");
  fs.writeFileSync(out, JSON.stringify(addresses, null, 2));
  console.log(`\nAddresses written to ${out}`);

  console.log("\n========== Deployment Summary ==========");
  for (const [k, v] of Object.entries(addresses.contracts)) {
    console.log(`  ${k.padEnd(18)} ${v}`);
  }
  console.log("========================================\n");
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
