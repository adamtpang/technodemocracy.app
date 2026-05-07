// =============================================================================
// Mock Data for Technodemocracy App
//
// Each "Party" is a digital political party. Joining grants the president a
// scoped, revocable franchise over the member's wallet (dues, slashing,
// delegated voting power, social follow). This is the social smart contract.
// =============================================================================

export interface IdeologyScores {
  [key: string]: number;
  longevity: number;
  decentralization: number;
  builderCurator: number;
  socialSolo: number;
  riskTolerance: number;
}

export interface FranchiseScope {
  duesUSDC: number;
  slashingMaxUSDC: number;
  delegatedVotingWeight: number;
  followAddresses: string[];
  scopes: string[];
}

export interface CabinetMember {
  address: string;
  role: string;
  powers: string[];
}

export interface Party {
  id: number;
  name: string;
  tagline: string;
  description: string;
  memberCount: number;
  treasuryBalance: number;
  president: string;
  cabinet: CabinetMember[];
  franchise: FranchiseScope;
  ideologyScores: IdeologyScores;
  color: string;
  emoji: string;
  foundedAt: string;
  openProposals: boolean;
  duesUSDC: number;
}

export type House = Party;

export interface Member {
  address: string;
  joinedAt: string;
  stakeAmount: number;
}

export interface Proposal {
  id: number;
  houseId: number;
  title: string;
  description: string;
  author: string;
  startTime: string;
  endTime: string;
  yesVotes: number;
  noVotes: number;
  status: "active" | "passed" | "failed";
  voters: { address: string; support: boolean; txHash: string; nftTokenId: number }[];
}

export interface IdeologyAxis {
  key: string;
  label: string;
  lowLabel: string;
  highLabel: string;
}

export interface IVotedNFT {
  tokenId: number;
  proposalId: number;
  proposalTitle: string;
  partyId: number;
  partyName: string;
  partyEmoji: string;
  partyColor: string;
  support: boolean;
  txHash: string;
  votedAt: string;
}

export interface NormsVersion {
  partyId: number;
  version: number;
  ipfsCID: string;
  contentHash: string;
  publishedAt: string;
  body: string;
}

export interface ElectionRace {
  raceId: number;
  partyId: number;
  startTime: string;
  endTime: string;
  candidates: { address: string; voteCount: number; manifesto: string }[];
  finalized: boolean;
  winner?: string;
}

export interface PartyEvent {
  id: number;
  partyId: number;
  title: string;
  description: string;
  location: string;
  startTime: string;
  rsvpCount: number;
  attended: number;
  isOnline: boolean;
}

export interface Dispute {
  id: number;
  partyId: number;
  complainant: string;
  defendant: string;
  normVersion: number;
  evidence: string;
  status: "pending" | "dismissed" | "slash" | "eject";
  filedAt: string;
  resolvedAt?: string;
  resolutionNote?: string;
}

export type FeedItemKind = "vote" | "join" | "proposal" | "election" | "found";

export interface FeedItem {
  id: string;
  kind: FeedItemKind;
  partyId: number;
  actor: string;
  timestamp: string;
  payload: Record<string, unknown>;
  txHash?: string;
}

export interface UserGrant {
  partyId: number;
  joinedAt: string;
  scopesGranted: string[];
  duesPaid: number;
  totalSlashed: number;
  cabinetRole?: string;
}

export interface PartyPost {
  id: number;
  partyId: number;
  author: string;
  authorName: string;
  authorHandle: string;
  authorVerified?: boolean;
  body: string;
  createdAt: string;
  replies: number;
  recasts: number;
  likes: number;
}

export interface SlateMember {
  address: string;
  name: string;
  handle: string;
  role: "President" | "VP" | "Treasurer" | "Cabinet";
}

export interface PartySocialMeta {
  /** President's display name + handle (Twitter/Farcaster style). */
  presidentName: string;
  presidentHandle: string;
  presidentVerified?: boolean;
  /** Long bio shown on the party landing. */
  bio: string;
  /** Slate the user votes for via the franchise consent screen. */
  slate: SlateMember[];
  /** "X, Y, and Z" — names shown in the social proof line. */
  socialProofNames: string[];
  /** Funding goal for the year, USDC. */
  fundingGoalUSDC: number;
  /** Current raised amount, USDC. */
  fundingRaisedUSDC: number;
}

export const IDEOLOGY_AXES: IdeologyAxis[] = [
  { key: "longevity", label: "Longevity", lowLabel: "YOLO", highLabel: "Forever" },
  { key: "decentralization", label: "Decentralization", lowLabel: "Centralized", highLabel: "Max Decentral" },
  { key: "builderCurator", label: "Builder vs Curator", lowLabel: "Curator", highLabel: "Builder" },
  { key: "socialSolo", label: "Social vs Solo", lowLabel: "Solo", highLabel: "Social" },
  { key: "riskTolerance", label: "Risk Tolerance", lowLabel: "Conservative", highLabel: "Degen" },
];

export const DEMO_USER_ADDRESS = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
export const CURRENT_USER_ADDRESS = DEMO_USER_ADDRESS;
export const CURRENT_USER_PARTY_ID = 1;
export const CURRENT_USER_STAKE = 100;
export const CURRENT_USER_HOUSE_ID = CURRENT_USER_PARTY_ID;

export const DEMO_USER_GRANTS: UserGrant[] = [
  {
    partyId: 1,
    joinedAt: "2026-02-15T08:00:00Z",
    scopesGranted: [
      "Vote for me as President of Don't Die",
      "Auto-debit 100 USDC annual party dues",
      "Slash up to 100 USDC of staked funds for norm violation",
      "Commit to Blueprint protocol attendance",
    ],
    duesPaid: 100,
    totalSlashed: 0,
  },
  {
    partyId: 3,
    joinedAt: "2026-01-08T11:30:00Z",
    scopesGranted: [
      "Vote for me as President of Open-Source AI Party",
      "Delegate 5% of voting weight on training-budget proposals",
      "Auto-debit 50 USDC annual party dues",
      "Commit weights from any party-funded training to public repo",
    ],
    duesPaid: 50,
    totalSlashed: 0,
    cabinetRole: "Compute Steward",
  },
  {
    partyId: 4,
    joinedAt: "2026-03-22T14:00:00Z",
    scopesGranted: [
      "Vote for me as President of Network State Party",
      "Auto-debit 75 USDC annual party dues",
      "Allow proof-of-residence attestations on census day",
    ],
    duesPaid: 75,
    totalSlashed: 0,
  },
];

export const PARTIES: Party[] = [
  {
    id: 1,
    name: "Don't Die Party",
    tagline: "Longevity",
    description:
      "Founded by Bryan Johnson. Optimize the body, defeat aging, refuse death. Members commit to Blueprint protocols and shared longevity research.",
    memberCount: 13439,
    treasuryBalance: 482000,
    president: "0x1234567890aBcDeF1234567890AbCdEf12345678",
    cabinet: [
      { address: "0x2B3C4D5E6F708192A3b4C5d6E7F80910a2B3c4D5", role: "Vice President", powers: ["Co-sign treasury spends > $5k", "Name interim dispute resolver"] },
      { address: "0x3F4E5D6C7B8A90010203F4e5D6c7B8a900102030", role: "Treasurer", powers: ["Propose spends ≤ $5k", "Publish quarterly budget onchain"] },
    ],
    franchise: {
      duesUSDC: 100, slashingMaxUSDC: 100, delegatedVotingWeight: 0.0,
      followAddresses: ["0x1234567890aBcDeF1234567890AbCdEf12345678", "0x2B3C4D5E6F708192A3b4C5d6E7F80910a2B3c4D5"],
      scopes: [
        "Vote for me as President of Don't Die",
        "Name me dispute resolver for party governance",
        "Slash up to 100 USDC of staked funds for norm violation",
        "Auto-debit 100 USDC annual party dues",
        "Commit to Blueprint protocol attendance",
      ],
    },
    ideologyScores: { longevity: 10, decentralization: 5, builderCurator: 7, socialSolo: 6, riskTolerance: 4 },
    color: "#10b981", emoji: "\u{1F33F}",
    foundedAt: "2025-09-01T00:00:00Z", openProposals: true, duesUSDC: 100,
  },
  {
    id: 2,
    name: "Mars Party",
    tagline: "Multiplanetary",
    description: "Make humanity multiplanetary. Members commit time and capital to advancing space technology, terraforming, and the off-world economy.",
    memberCount: 8721, treasuryBalance: 920000,
    president: "0xA1B2C3D4E5F60718293a4b5c6D7E8F9001234567",
    cabinet: [
      { address: "0xB2C3D4E5F6071829A3b4c5D6E7F89001a2345678", role: "Chief Engineer", powers: ["Allocate engineering grants ≤ $25k", "Veto proposals on launch safety"] },
      { address: "0xC3D4E5F60718293aB4c5D6e7F89001A23456789a", role: "Treasurer", powers: ["Propose spends ≤ $10k", "Publish monthly burn rate onchain"] },
    ],
    franchise: {
      duesUSDC: 250, slashingMaxUSDC: 250, delegatedVotingWeight: 0.1,
      followAddresses: ["0xA1B2C3D4E5F60718293a4b5c6D7E8F9001234567", "0xB2C3D4E5F6071829A3b4c5D6E7F89001a2345678"],
      scopes: [
        "Vote for me as President of Mars Party",
        "Delegate 10% of voting weight on launch-window decisions",
        "Slash up to 250 USDC for missed mission commitments",
        "Auto-debit 250 USDC annual party dues",
        "Subscribe to monthly mission updates",
      ],
    },
    ideologyScores: { longevity: 6, decentralization: 4, builderCurator: 10, socialSolo: 5, riskTolerance: 9 },
    color: "#ef4444", emoji: "\u{1F680}",
    foundedAt: "2025-07-04T00:00:00Z", openProposals: false, duesUSDC: 250,
  },
  {
    id: 3,
    name: "Open-Source AI Party",
    tagline: "OSS AI",
    description: "Models should be open. Weights should be free. Members fund OSS model training, GPU collectives, and open-eval infrastructure.",
    memberCount: 5102, treasuryBalance: 310000,
    president: "0x9876FeDcBa0987654321FeDcBa09876543210000",
    cabinet: [
      { address: "0x8765FeDcBa098765432100AbCdEf1234567890aB", role: "Vice President", powers: ["Co-sign GPU grant releases", "Approve party-wide research RFPs"] },
      { address: "0x7654FeDcBa0987654321AbCdEf01234567890aBc", role: "Compute Steward", powers: ["Allocate GPU credits ≤ $15k", "Onboard new training partners"] },
    ],
    franchise: {
      duesUSDC: 50, slashingMaxUSDC: 50, delegatedVotingWeight: 0.05,
      followAddresses: ["0x9876FeDcBa0987654321FeDcBa09876543210000", "0x8765FeDcBa098765432100AbCdEf1234567890aB"],
      scopes: [
        "Vote for me as President of Open-Source AI Party",
        "Delegate 5% of voting weight on training-budget proposals",
        "Slash up to 50 USDC for closed-model norm violations",
        "Auto-debit 50 USDC annual party dues",
        "Commit weights from any party-funded training to public repo",
      ],
    },
    ideologyScores: { longevity: 5, decentralization: 9, builderCurator: 9, socialSolo: 4, riskTolerance: 7 },
    color: "#6366f1", emoji: "\u{1F916}",
    foundedAt: "2025-05-15T00:00:00Z", openProposals: true, duesUSDC: 50,
  },
  {
    id: 4,
    name: "Network State Party",
    tagline: "Onchain Polities",
    description: "Build the cloud-first, land-second nation. Members coordinate offline meetups, contribute to network-state infrastructure, and vote in censorship-resistant elections.",
    memberCount: 21008, treasuryBalance: 1240000,
    president: "0xCaFeBaBe00112233445566778899AaBbCcDdEeFf",
    cabinet: [
      { address: "0xDeAdBeEf00112233445566778899aAbBcCdDeEfF", role: "Vice President", powers: ["Approve network-state grants ≤ $20k", "Run election infrastructure"] },
      { address: "0xFaCeFeed00112233445566778899AABBccDDeeFF", role: "Treasurer", powers: ["Propose spends ≤ $10k", "Issue quarterly network-state budget"] },
      { address: "0xBaD00Dad00112233445566778899aaBBCCddEEff", role: "Diplomat", powers: ["Negotiate cross-party alliances", "Sign census attestations"] },
    ],
    franchise: {
      duesUSDC: 75, slashingMaxUSDC: 75, delegatedVotingWeight: 0.15,
      followAddresses: ["0xCaFeBaBe00112233445566778899AaBbCcDdEeFf", "0xDeAdBeEf00112233445566778899aAbBcCdDeEfF", "0xFaCeFeed00112233445566778899AABBccDDeeFF"],
      scopes: [
        "Vote for me as President of Network State Party",
        "Delegate 15% of voting weight on diplomatic proposals",
        "Slash up to 75 USDC for census-fraud or sybil violations",
        "Auto-debit 75 USDC annual party dues",
        "Allow proof-of-residence attestations on census day",
      ],
    },
    ideologyScores: { longevity: 7, decentralization: 10, builderCurator: 8, socialSolo: 8, riskTolerance: 6 },
    color: "#f59e0b", emoji: "\u{1F30D}",
    foundedAt: "2025-04-20T00:00:00Z", openProposals: true, duesUSDC: 75,
  },
];

export const HOUSES = PARTIES;
export const houses = PARTIES;
export const parties = PARTIES;

export const MEMBERS: Record<number, Member[]> = {
  1: [
    { address: CURRENT_USER_ADDRESS, joinedAt: "2026-02-15T08:00:00Z", stakeAmount: 100 },
    { address: "0x1234567890aBcDeF1234567890AbCdEf12345678", joinedAt: "2025-09-01T12:30:00Z", stakeAmount: 500 },
    { address: "0x2B3C4D5E6F708192A3b4C5d6E7F80910a2B3c4D5", joinedAt: "2025-09-20T09:15:00Z", stakeAmount: 250 },
    { address: "0x3F4E5D6C7B8A90010203F4e5D6c7B8a900102030", joinedAt: "2025-10-02T14:45:00Z", stakeAmount: 200 },
    { address: "0x5A6B7C8D9E0F1A2B3C4D5a6b7C8d9E0f1A2b3C4D", joinedAt: "2025-11-10T11:00:00Z", stakeAmount: 100 },
    { address: "0x7E8F9A0B1C2D3E4F5A6B7e8f9A0b1C2d3E4f5A6B", joinedAt: "2026-01-05T16:20:00Z", stakeAmount: 150 },
  ],
  2: [
    { address: "0xA1B2C3D4E5F60718293a4b5c6D7E8F9001234567", joinedAt: "2025-07-04T10:00:00Z", stakeAmount: 1000 },
    { address: "0xB2C3D4E5F6071829A3b4c5D6E7F89001a2345678", joinedAt: "2025-07-15T07:30:00Z", stakeAmount: 500 },
    { address: "0xC3D4E5F60718293aB4c5D6e7F89001A23456789a", joinedAt: "2025-08-01T13:00:00Z", stakeAmount: 250 },
    { address: "0xD4E5F60718293Ab4C5d6E7f89001a23456789AbC", joinedAt: "2025-09-22T08:45:00Z", stakeAmount: 350 },
    { address: "0xE5F60718293aB4c5D6E7F89001A23456789aBcDe", joinedAt: "2025-10-30T15:10:00Z", stakeAmount: 250 },
  ],
  3: [
    { address: "0x9876FeDcBa0987654321FeDcBa09876543210000", joinedAt: "2025-05-15T09:00:00Z", stakeAmount: 200 },
    { address: "0x8765FeDcBa098765432100AbCdEf1234567890aB", joinedAt: "2025-06-05T12:00:00Z", stakeAmount: 150 },
    { address: "0x7654FeDcBa0987654321AbCdEf01234567890aBc", joinedAt: "2025-08-18T10:30:00Z", stakeAmount: 100 },
  ],
  4: [
    { address: "0xCaFeBaBe00112233445566778899AaBbCcDdEeFf", joinedAt: "2025-04-20T11:00:00Z", stakeAmount: 750 },
    { address: "0xDeAdBeEf00112233445566778899aAbBcCdDeEfF", joinedAt: "2025-05-28T09:30:00Z", stakeAmount: 300 },
    { address: "0xFaCeFeed00112233445566778899AABBccDDeeFF", joinedAt: "2025-06-14T13:45:00Z", stakeAmount: 175 },
  ],
};

export const PROPOSALS: Proposal[] = [
  {
    id: 1, houseId: 1,
    title: "Fund Blueprint Protocol Onboarding for 100 New Members",
    description: "Allocate 25,000 USDC to subsidize the first month of Blueprint protocol supplements and biomarkers for 100 new Don't Die members.",
    author: "0x1234567890aBcDeF1234567890AbCdEf12345678",
    startTime: "2026-04-25T00:00:00Z", endTime: "2026-05-02T00:00:00Z",
    yesVotes: 18, noVotes: 3, status: "active",
    voters: [
      { address: CURRENT_USER_ADDRESS, support: true, txHash: "0xa1b2c3d4e5f6071829304050607080901a2b3c4d5e6f071829304050607080ab", nftTokenId: 1001 },
      { address: "0x2B3C4D5E6F708192A3b4C5d6E7F80910a2B3c4D5", support: true, txHash: "0xb2c3d4e5f60718293040506070809010a2b3c4d5e6f0718293040506070809cd", nftTokenId: 1002 },
      { address: "0x3F4E5D6C7B8A90010203F4e5D6c7B8a900102030", support: true, txHash: "0xc3d4e5f607182930405060708090102a2b3c4d5e6f07182930405060708090ef", nftTokenId: 1003 },
      { address: "0x7E8F9A0B1C2D3E4F5A6B7e8f9A0b1C2d3E4f5A6B", support: false, txHash: "0xe5f60718293040506070809010203a2b3c4d5e6f07182930405060708090dead", nftTokenId: 1005 },
    ],
  },
  {
    id: 2, houseId: 2,
    title: "Sponsor Open-Source Raptor Engine Telemetry Library",
    description: "Allocate 50,000 USDC to fund development of an open-source telemetry analysis toolkit for sub-orbital test data.",
    author: "0xB2C3D4E5F6071829A3b4c5D6E7F89001a2345678",
    startTime: "2026-04-22T00:00:00Z", endTime: "2026-04-29T00:00:00Z",
    yesVotes: 27, noVotes: 4, status: "passed",
    voters: [
      { address: "0xA1B2C3D4E5F60718293a4b5c6D7E8F9001234567", support: true, txHash: "0x11a2b3c4d5e6f0718293040506070809010203040506070809010203040506ab", nftTokenId: 2001 },
      { address: "0xB2C3D4E5F6071829A3b4c5D6E7F89001a2345678", support: true, txHash: "0x22b3c4d5e6f07182930405060708090102030405060708090102030405060cd", nftTokenId: 2002 },
    ],
  },
  {
    id: 3, houseId: 3,
    title: "Allocate 100k USDC to GPU Co-op for Open Llama Reproduction",
    description: "Fund a 3-month GPU lease via the OSS AI Compute Co-op to reproduce a frontier-class open model with fully open weights and training data.",
    author: "0x9876FeDcBa0987654321FeDcBa09876543210000",
    startTime: "2026-04-26T00:00:00Z", endTime: "2026-05-03T00:00:00Z",
    yesVotes: 41, noVotes: 6, status: "active",
    voters: [
      { address: "0x9876FeDcBa0987654321FeDcBa09876543210000", support: true, txHash: "0xaa11223344556677889900aabbccddeeff00112233445566778899aabbccddee", nftTokenId: 3001 },
      { address: "0x8765FeDcBa098765432100AbCdEf1234567890aB", support: true, txHash: "0xbb22334455667788990011aabbccddeeff112233445566778899aabbccddeeff", nftTokenId: 3002 },
    ],
  },
  {
    id: 4, houseId: 4,
    title: "Network State Census Day — June 1, 2026",
    description: "Approve the second annual census, requiring all members to submit cryptographic proof-of-residence and proof-of-attendance attestations.",
    author: "0xCaFeBaBe00112233445566778899AaBbCcDdEeFf",
    startTime: "2026-04-15T00:00:00Z", endTime: "2026-04-22T00:00:00Z",
    yesVotes: 156, noVotes: 12, status: "passed",
    voters: [
      { address: "0xCaFeBaBe00112233445566778899AaBbCcDdEeFf", support: true, txHash: "0x1100aabbccddeeff00112233445566778899aabbccddeeff0011223344556677", nftTokenId: 4001 },
      { address: "0xDeAdBeEf00112233445566778899aAbBcCdDeEfF", support: true, txHash: "0x2200bbccddeeff0011223344556677889900aabbccddeeff1122334455667788", nftTokenId: 4002 },
    ],
  },
  {
    id: 5, houseId: 1,
    title: "Quarterly Workout Blueprint Convening — May 15",
    description: "Reserve 8,000 USDC for the quarterly Don't Die in-person convening: workout blueprint, longevity policy group, and party dinner.",
    author: "0x2B3C4D5E6F708192A3b4C5d6E7F80910a2B3c4D5",
    startTime: "2026-04-28T00:00:00Z", endTime: "2026-05-05T00:00:00Z",
    yesVotes: 14, noVotes: 2, status: "active",
    voters: [
      { address: "0x2B3C4D5E6F708192A3b4C5d6E7F80910a2B3c4D5", support: true, txHash: "0xab01020304050607080910111213141516171819202122232425262728293031", nftTokenId: 1101 },
      { address: CURRENT_USER_ADDRESS, support: true, txHash: "0xbc02030405060708091011121314151617181920212223242526272829303132", nftTokenId: 1102 },
    ],
  },
];

export function getPartyById(id: number): Party | undefined {
  return PARTIES.find((p) => p.id === id);
}
export function getProposalsByParty(partyId: number): Proposal[] {
  return PROPOSALS.filter((p) => p.houseId === partyId);
}
export function getProposalById(id: number): Proposal | undefined {
  return PROPOSALS.find((p) => p.id === id);
}
export function getMembersByParty(partyId: number): Member[] {
  return MEMBERS[partyId] ?? [];
}
export const getHouseById = getPartyById;
export const getProposalsByHouse = getProposalsByParty;
export const getMembersByHouse = getMembersByParty;
export const proposals = PROPOSALS;

export function getNFTsByAddress(address: string): IVotedNFT[] {
  const owned: IVotedNFT[] = [];
  for (const proposal of PROPOSALS) {
    const party = getPartyById(proposal.houseId);
    if (!party) continue;
    for (const voter of proposal.voters) {
      if (voter.address.toLowerCase() === address.toLowerCase()) {
        owned.push({
          tokenId: voter.nftTokenId,
          proposalId: proposal.id,
          proposalTitle: proposal.title,
          partyId: party.id, partyName: party.name,
          partyEmoji: party.emoji, partyColor: party.color,
          support: voter.support, txHash: voter.txHash,
          votedAt: proposal.startTime,
        });
      }
    }
  }
  return owned.sort((a, b) => b.tokenId - a.tokenId);
}

export const NORMS: Record<number, NormsVersion[]> = {
  1: [
    {
      partyId: 1, version: 1,
      ipfsCID: "ipfs://bafyreid-dontdie-v1",
      contentHash: "0x7e1c4f2a8b6d3e9f5a1c7b8d2e4f6a9c3b5d7e8f1a2c4d6e8f9a0b1c2d3e4f50",
      publishedAt: "2025-09-01T00:00:00Z",
      body: `# Don't Die Party Norms — v1\n\n1. **Blueprint adherence.** Members commit to logging at least 80% of Blueprint protocol days per quarter, verifiable via on-chain attestation.\n2. **Honest biomarkers.** All published biomarkers must be from accredited labs. Falsified data is grounds for slashing.\n3. **No closed-source supplements.** Members may not promote proprietary stacks not auditable by other members.\n4. **Mutual aid.** When a member's biomarkers regress, others have 7 days to offer support before public criticism is permitted.`,
    },
    {
      partyId: 1, version: 2,
      ipfsCID: "ipfs://bafyreid-dontdie-v2",
      contentHash: "0xa3f2c8e1d4b7a9c5e2f6b8d3a1c7e9f0b2d4a6c8e1f3b5d7a9c0e2f4b6d8a0c2",
      publishedAt: "2026-01-15T00:00:00Z",
      body: `# Don't Die Party Norms — v2\n\n(v1 + the following amendments approved by member vote on 2026-01-12.)\n\n5. **Mandatory annual physical.** Members submit a comprehensive annual physical attestation hash by their joining anniversary.\n6. **No anti-aging snake oil.** Promoting unproven anti-aging supplements (no published trial data) is a violation.`,
    },
  ],
  2: [
    {
      partyId: 2, version: 1,
      ipfsCID: "ipfs://bafyreid-mars-v1",
      contentHash: "0xb2e4c6a8d1f3b5e7c9a2d4f6b8e0c2a4d6f8b0e2c4a6d8f0b2e4c6a8d0f2e4c6",
      publishedAt: "2025-07-04T00:00:00Z",
      body: `# Mars Party Norms — v1\n\n1. **Mission first.** No party action may compromise launch-window safety.\n2. **Open telemetry.** All party-funded engineering data must be published within 90 days.\n3. **No suborbital tourism marketing.** Mars is the goal; tourism is a distraction.\n4. **In-person quarterly review.** Members commit to attending at least one in-person Mars Party convening per year.`,
    },
  ],
  3: [
    {
      partyId: 3, version: 1,
      ipfsCID: "ipfs://bafyreid-ossai-v1",
      contentHash: "0xc3d5e7f9a1c3b5d7e9c1a3f5d7b9c1e3a5d7f9b1c3e5a7d9b1f3e5c7a9d1f3e5",
      publishedAt: "2025-05-15T00:00:00Z",
      body: `# Open-Source AI Party Norms — v1\n\n1. **Open weights, full stop.** Any model trained with party funds must publish its weights and training data within 30 days of training completion.\n2. **No closed-source contributions during cabinet seats.** Cabinet members may not work on closed AI products during their tenure.\n3. **Reproducibility.** All published evals must include a reproducible harness in the party's open-eval repo.\n4. **No hype.** Public communications must avoid unsubstantiated capability claims about funded models.`,
    },
  ],
  4: [
    {
      partyId: 4, version: 1,
      ipfsCID: "ipfs://bafyreid-ns-v1",
      contentHash: "0xd4e6f8a0c2d4e6f8a0c2d4e6f8a0c2d4e6f8a0c2d4e6f8a0c2d4e6f8a0c2d4e6",
      publishedAt: "2025-04-20T00:00:00Z",
      body: `# Network State Party Norms — v1\n\n1. **Census participation.** Members must attest at least once per annual census window or lose voting rights for the year.\n2. **No sybil.** One wallet, one vote. Members caught operating multiple identities are immediately ejected.\n3. **Diplomatic neutrality.** Members do not endorse or attack other parties as Network State Party representatives without cabinet authorization.\n4. **Cloud-first commits.** Network State infrastructure contributions are open-source by default.`,
    },
  ],
};

export function getNormsForParty(partyId: number): NormsVersion[] {
  return NORMS[partyId] ?? [];
}
export function getCurrentNorms(partyId: number): NormsVersion | undefined {
  const versions = NORMS[partyId];
  return versions ? versions[versions.length - 1] : undefined;
}

export const ELECTIONS: ElectionRace[] = [
  {
    raceId: 1, partyId: 2,
    startTime: "2026-04-25T00:00:00Z", endTime: "2026-05-09T00:00:00Z",
    finalized: false,
    candidates: [
      { address: "0xA1B2C3D4E5F60718293a4b5c6D7E8F9001234567", voteCount: 4218, manifesto: "Continue the current trajectory: open telemetry, quarterly conventions, no suborbital distractions. Year 2 of the 5-year Mars-or-bust plan." },
      { address: "0xC3D4E5F60718293aB4c5D6e7F89001A23456789a", voteCount: 3104, manifesto: "Triple the engineering grant program. Open junior chapters in 50 cities. We need talent at the bottom of the funnel — not just at SpaceX." },
    ],
  },
  {
    raceId: 2, partyId: 1,
    startTime: "2026-01-01T00:00:00Z", endTime: "2026-01-15T00:00:00Z",
    finalized: true, winner: "0x1234567890aBcDeF1234567890AbCdEf12345678",
    candidates: [
      { address: "0x1234567890aBcDeF1234567890AbCdEf12345678", voteCount: 11200, manifesto: "Re-elect for term 2. Blueprint expansion + biomarker open-source." },
      { address: "0x5A6B7C8D9E0F1A2B3C4D5a6b7C8d9E0f1A2b3C4D", voteCount: 2239, manifesto: "Slow the pace. Focus on member retention over recruitment." },
    ],
  },
];

export function getActiveElection(partyId: number): ElectionRace | undefined {
  return ELECTIONS.find((e) => e.partyId === partyId && !e.finalized);
}
export function getElectionsForParty(partyId: number): ElectionRace[] {
  return ELECTIONS.filter((e) => e.partyId === partyId);
}

export const PARTY_EVENTS: PartyEvent[] = [
  { id: 1, partyId: 1, title: "Quarterly Workout Blueprint Convening", description: "Workout, longevity policy roundtable, and party dinner.", location: "Singapore — Network School Campus", startTime: "2026-05-15T18:00:00Z", rsvpCount: 187, attended: 0, isOnline: false },
  { id: 2, partyId: 2, title: "Boca Chica Launch Watch Party", description: "Members-only watch with live commentary from cabinet engineers.", location: "Boca Chica, TX", startTime: "2026-05-20T12:00:00Z", rsvpCount: 412, attended: 0, isOnline: false },
  { id: 3, partyId: 3, title: "Open Llama Reproduction Office Hours", description: "Live coding session with the GPU co-op stewards.", location: "Online — Zoom + onchain attestation", startTime: "2026-05-08T17:00:00Z", rsvpCount: 89, attended: 0, isOnline: true },
  { id: 4, partyId: 4, title: "Network State Census Day", description: "Submit cryptographic proof-of-residence and proof-of-attendance attestations.", location: "Worldwide — coordinated 24h window", startTime: "2026-06-01T00:00:00Z", rsvpCount: 8421, attended: 0, isOnline: true },
];

export function getEventsForParty(partyId: number): PartyEvent[] {
  return PARTY_EVENTS.filter((e) => e.partyId === partyId);
}
export function getUpcomingEvents(): PartyEvent[] {
  const now = Date.now();
  return PARTY_EVENTS.filter((e) => new Date(e.startTime).getTime() > now)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
}

export const DISPUTES: Dispute[] = [
  { id: 1, partyId: 3, complainant: "0x9876FeDcBa0987654321FeDcBa09876543210000", defendant: "0x6543FeDcBa09876543210AbCdEf234567890aBcD", normVersion: 1, evidence: "Defendant published a closed-weights model trained partially with party-funded GPU credits.", status: "pending", filedAt: "2026-04-26T11:00:00Z" },
  { id: 2, partyId: 1, complainant: "0x2B3C4D5E6F708192A3b4C5d6E7F80910a2B3c4D5", defendant: "0x7E8F9A0B1C2D3E4F5A6B7e8f9A0b1C2d3E4f5A6B", normVersion: 2, evidence: "Defendant promoted an unproven proprietary supplement on a public livestream while wearing party-branded apparel.", status: "slash", filedAt: "2026-03-12T09:30:00Z", resolvedAt: "2026-03-19T16:00:00Z", resolutionNote: "Verdict: Slash 50 USDC. Public retraction required within 7 days. Repeat offense triggers Eject." },
];

export function getDisputesForParty(partyId: number): Dispute[] {
  return DISPUTES.filter((d) => d.partyId === partyId);
}

const SYNTHETIC_JOINS = [
  { partyId: 4, address: "0xCa5caDe000112233445566778899AaBbCcDdEeFf", at: "2026-04-30T13:42:00Z", txHash: "0xfeed01" },
  { partyId: 3, address: "0xBaD00Dad00112233445566778899aaBBCCddEEff", at: "2026-04-30T12:08:00Z", txHash: "0xfeed02" },
  { partyId: 1, address: "0xC0ffEE0000112233445566778899AaBbCcDdEeFf", at: "2026-04-30T11:45:00Z", txHash: "0xfeed03" },
  { partyId: 2, address: "0x1098FeDcBa0987654321AbCdEf7890aBcDeF0123", at: "2026-04-30T10:22:00Z", txHash: "0xfeed04" },
  { partyId: 4, address: "0x4321FeDcBa0987654321AbCdEf4567890aBcDeF0", at: "2026-04-30T09:11:00Z", txHash: "0xfeed05" },
];

export function getStreamingFeed(limit = 40): FeedItem[] {
  const items: FeedItem[] = [];
  for (const p of PROPOSALS) {
    for (const v of p.voters) {
      items.push({
        id: `vote-${p.id}-${v.address}`, kind: "vote",
        partyId: p.houseId, actor: v.address,
        timestamp: p.startTime, txHash: v.txHash,
        payload: { proposalId: p.id, proposalTitle: p.title, support: v.support, nftTokenId: v.nftTokenId },
      });
    }
  }
  for (const j of SYNTHETIC_JOINS) {
    items.push({ id: `join-${j.partyId}-${j.address}`, kind: "join", partyId: j.partyId, actor: j.address, timestamp: j.at, txHash: j.txHash, payload: {} });
  }
  for (const p of PROPOSALS) {
    items.push({ id: `proposal-${p.id}`, kind: "proposal", partyId: p.houseId, actor: p.author, timestamp: p.startTime, payload: { proposalId: p.id, proposalTitle: p.title } });
  }
  for (const e of ELECTIONS) {
    items.push({ id: `election-${e.raceId}-start`, kind: "election", partyId: e.partyId, actor: "0x0000000000000000000000000000000000000000", timestamp: e.startTime, payload: { raceId: e.raceId, candidates: e.candidates.length, finalized: e.finalized } });
  }
  for (const p of PARTIES) {
    items.push({ id: `found-${p.id}`, kind: "found", partyId: p.id, actor: p.president, timestamp: p.foundedAt, payload: { name: p.name } });
  }
  items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return items.slice(0, limit);
}

export function getUserGrants(address: string): UserGrant[] {
  if (address.toLowerCase() === DEMO_USER_ADDRESS.toLowerCase()) {
    return DEMO_USER_GRANTS;
  }
  return [];
}
export function isUserMember(address: string, partyId: number): boolean {
  return getUserGrants(address).some((g) => g.partyId === partyId);
}

export function getTotalOnchainVotes(): number {
  return PROPOSALS.reduce((sum, p) => sum + p.yesVotes + p.noVotes, 0);
}
export function getTotalMembers(): number {
  return PARTIES.reduce((sum, p) => sum + p.memberCount, 0);
}
export function getTotalTreasury(): number {
  return PARTIES.reduce((sum, p) => sum + p.treasuryBalance, 0);
}

// -----------------------------------------------------------------------------
// Party social meta (Twitter/Farcaster-style profile + slate)
// -----------------------------------------------------------------------------

export const PARTY_SOCIAL: Record<number, PartySocialMeta> = {
  1: {
    presidentName: "Bryan Johnson",
    presidentHandle: "bryan_johnson",
    presidentVerified: true,
    bio: "I founded the Don't Die Party to literally end death. Our 13,439 members follow the Blueprint protocol and advocate for faster cures. Apply if you want to join!",
    slate: [
      { address: "0x1234567890aBcDeF1234567890AbCdEf12345678", name: "Bryan Johnson", handle: "bryan_johnson", role: "President" },
      { address: "0x2B3C4D5E6F708192A3b4C5d6E7F80910a2B3c4D5", name: "Anna Nguyen", handle: "anna_ng", role: "VP" },
      { address: "0x3F4E5D6C7B8A90010203F4e5D6c7B8a900102030", name: "Jay Park", handle: "jay_park", role: "Treasurer" },
    ],
    socialProofNames: ["James Smith", "Kelly Lu", "Rohit Singh"],
    fundingGoalUSDC: 1_000_000,
    fundingRaisedUSDC: 330_000,
  },
  2: {
    presidentName: "Elon Musk",
    presidentHandle: "elonmusk",
    presidentVerified: true,
    bio: "Make humanity multiplanetary. Mars Party members fund open-source rocketry, junior chapters in 50 cities, and refuse the suborbital tourism distraction. Year 2 of the 5-year plan.",
    slate: [
      { address: "0xA1B2C3D4E5F60718293a4b5c6D7E8F9001234567", name: "Elon Musk", handle: "elonmusk", role: "President" },
      { address: "0xB2C3D4E5F6071829A3b4c5D6E7F89001a2345678", name: "Tom Mueller", handle: "tom_mueller", role: "Cabinet" },
      { address: "0xC3D4E5F60718293aB4c5D6e7F89001A23456789a", name: "Gwynne S.", handle: "gwynnes", role: "Treasurer" },
    ],
    socialProofNames: ["Tim Dodd", "Felix Schlang", "Marcus House"],
    fundingGoalUSDC: 2_000_000,
    fundingRaisedUSDC: 920_000,
  },
  3: {
    presidentName: "Daniel Gross",
    presidentHandle: "danielgross",
    presidentVerified: true,
    bio: "Models should be open. Weights should be free. We fund GPU collectives, open-eval infrastructure, and any model trained with party funds publishes weights within 30 days.",
    slate: [
      { address: "0x9876FeDcBa0987654321FeDcBa09876543210000", name: "Daniel Gross", handle: "danielgross", role: "President" },
      { address: "0x8765FeDcBa098765432100AbCdEf1234567890aB", name: "Nat Friedman", handle: "natfriedman", role: "VP" },
      { address: "0x7654FeDcBa0987654321AbCdEf01234567890aBc", name: "Soumith C.", handle: "soumithchintala", role: "Cabinet" },
    ],
    socialProofNames: ["Andrej K.", "Jeremy Howard", "Tri Dao"],
    fundingGoalUSDC: 750_000,
    fundingRaisedUSDC: 310_000,
  },
  4: {
    presidentName: "Balaji Srinivasan",
    presidentHandle: "balajis",
    presidentVerified: true,
    bio: "Cloud-first nation, land-second. Network State Party members coordinate offline meetups, fund census infrastructure, and vote in censorship-resistant elections. The end-party system starts here.",
    slate: [
      { address: "0xCaFeBaBe00112233445566778899AaBbCcDdEeFf", name: "Balaji Srinivasan", handle: "balajis", role: "President" },
      { address: "0xDeAdBeEf00112233445566778899aAbBcCdDeEfF", name: "Lulu Cheng", handle: "lulumeservey", role: "VP" },
      { address: "0xFaCeFeed00112233445566778899AABBccDDeeFF", name: "Niraj Pant", handle: "niraj", role: "Treasurer" },
    ],
    socialProofNames: ["Jakub", "Vivek W.", "Pranay K."],
    fundingGoalUSDC: 3_000_000,
    fundingRaisedUSDC: 1_240_000,
  },
};

export function getPartySocial(partyId: number): PartySocialMeta | undefined {
  return PARTY_SOCIAL[partyId];
}

// -----------------------------------------------------------------------------
// Posts (Twitter / Farcaster style)
// -----------------------------------------------------------------------------

export const POSTS: PartyPost[] = [
  {
    id: 1, partyId: 1,
    author: "0x1234567890aBcDeF1234567890AbCdEf12345678",
    authorName: "Bryan Johnson",
    authorHandle: "bryan_johnson",
    authorVerified: true,
    body: "Allulose — a sugar alternative — reduces post-meal blood glucose and fat accumulation. Randomized controlled trials show its positive effects on plasma glucose, insulin release, and weight loss in healthy individuals.",
    createdAt: "2026-04-30T14:00:00Z",
    replies: 1100, recasts: 349, likes: 9200,
  },
  {
    id: 2, partyId: 1,
    author: "0x1234567890aBcDeF1234567890AbCdEf12345678",
    authorName: "Bryan Johnson",
    authorHandle: "bryan_johnson",
    authorVerified: true,
    body: "MRI images and gross pathology of abdominal visceral fat deposits of mice are presented in this study. Eight weeks of supplementation reduced visceral fat by 40% in the treatment group. Public dataset available on the party repo.",
    createdAt: "2026-04-29T09:15:00Z",
    replies: 412, recasts: 188, likes: 4400,
  },
  {
    id: 3, partyId: 1,
    author: "0x2B3C4D5E6F708192A3b4C5d6E7F80910a2B3c4D5",
    authorName: "Anna Nguyen",
    authorHandle: "anna_ng",
    body: "Just finalized this quarter's Blueprint convening venue: Network School Singapore campus, May 15. Cabinet treasurer's reserve covers food + transport. RSVP onchain to mint your proof-of-attendance NFT.",
    createdAt: "2026-04-28T17:30:00Z",
    replies: 88, recasts: 124, likes: 1800,
  },
  {
    id: 4, partyId: 2,
    author: "0xA1B2C3D4E5F60718293a4b5c6D7E8F9001234567",
    authorName: "Elon Musk",
    authorHandle: "elonmusk",
    authorVerified: true,
    body: "Mars Party Junior chapter in Boca Chica is live. 50 kids building model rockets every Saturday. Funded by member dues, ran by cabinet engineers on weekends. Multiplanetary doesn't ship itself.",
    createdAt: "2026-04-30T08:00:00Z",
    replies: 2100, recasts: 5300, likes: 31000,
  },
  {
    id: 5, partyId: 2,
    author: "0xB2C3D4E5F6071829A3b4c5D6E7F89001a2345678",
    authorName: "Tom Mueller",
    authorHandle: "tom_mueller",
    body: "Open-source Raptor telemetry library v0.1 is shipping next week. Contribute via the party's GitHub or attend office hours during the Boca Chica launch watch party (May 20).",
    createdAt: "2026-04-29T11:00:00Z",
    replies: 240, recasts: 410, likes: 3600,
  },
  {
    id: 6, partyId: 3,
    author: "0x9876FeDcBa0987654321FeDcBa09876543210000",
    authorName: "Daniel Gross",
    authorHandle: "danielgross",
    authorVerified: true,
    body: "100k USDC proposal to lease GPU time for an Open-Llama reproduction is now streaming. 41 yes / 6 no with 5 days left. Vote with your wallet — or your delegated bps if you've granted them. Provably bounded, fully open weights.",
    createdAt: "2026-04-30T10:30:00Z",
    replies: 312, recasts: 540, likes: 4200,
  },
  {
    id: 7, partyId: 3,
    author: "0x8765FeDcBa098765432100AbCdEf1234567890aB",
    authorName: "Nat Friedman",
    authorHandle: "natfriedman",
    body: "Open-eval harness v2 published. Anyone can submit attested benchmark scores on-chain via the Census contract. Cheating costs you a slash + dispute.",
    createdAt: "2026-04-27T19:00:00Z",
    replies: 95, recasts: 220, likes: 2100,
  },
  {
    id: 8, partyId: 4,
    author: "0xCaFeBaBe00112233445566778899AaBbCcDdEeFf",
    authorName: "Balaji Srinivasan",
    authorHandle: "balajis",
    authorVerified: true,
    body: "We just crossed 21,000 census-attested members. The Network State Party is now larger by attested headcount than several UN-recognized microstates. Onchain wins.",
    createdAt: "2026-04-30T12:30:00Z",
    replies: 1800, recasts: 4100, likes: 18000,
  },
  {
    id: 9, partyId: 4,
    author: "0xDeAdBeEf00112233445566778899aAbBcCdDeEfF",
    authorName: "Lulu Cheng",
    authorHandle: "lulumeservey",
    body: "Próspera embassy proposal at 89/22. Diplomatic neutrality is a hard norm — no party content from the embassy without cabinet sign-off. Vote streams onchain.",
    createdAt: "2026-04-29T08:45:00Z",
    replies: 280, recasts: 510, likes: 3200,
  },
];

export function getPostsForParty(partyId: number): PartyPost[] {
  return POSTS.filter((p) => p.partyId === partyId).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
