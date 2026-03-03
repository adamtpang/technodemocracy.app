// =============================================================================
// Mock Data for Technodemocracy App
// =============================================================================

// -----------------------------------------------------------------------------
// Types & Interfaces
// -----------------------------------------------------------------------------

export interface IdeologyScores {
  [key: string]: number;
  longevity: number;
  decentralization: number;
  builderCurator: number;
  socialSolo: number;
  riskTolerance: number;
}

export interface House {
  id: number;
  name: string;
  description: string;
  memberCount: number;
  treasuryBalance: number; // in USDC
  leader: string;
  ideologyScores: IdeologyScores;
  color: string; // hex
  emoji: string;
}

export interface Member {
  address: string;
  joinedAt: string; // ISO date string
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
  voters: { address: string; support: boolean; txHash: string }[];
}

export interface IdeologyAxis {
  key: string;
  label: string;
  lowLabel: string;
  highLabel: string;
}

export interface VoteRecord {
  proposalId: number;
  support: boolean;
  txHash: string;
  timestamp: string;
}

// -----------------------------------------------------------------------------
// Ideology Axes
// -----------------------------------------------------------------------------

export const IDEOLOGY_AXES: IdeologyAxis[] = [
  { key: "longevity", label: "Longevity", lowLabel: "YOLO", highLabel: "Forever" },
  { key: "decentralization", label: "Decentralization", lowLabel: "Centralized", highLabel: "Max Decentral" },
  { key: "builderCurator", label: "Builder vs Curator", lowLabel: "Curator", highLabel: "Builder" },
  { key: "socialSolo", label: "Social vs Solo", lowLabel: "Solo", highLabel: "Social" },
  { key: "riskTolerance", label: "Risk Tolerance", lowLabel: "Conservative", highLabel: "Degen" },
];

// -----------------------------------------------------------------------------
// Current User
// -----------------------------------------------------------------------------

export const CURRENT_USER_ADDRESS = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
export const CURRENT_USER_HOUSE_ID = 1;
export const CURRENT_USER_STAKE = 10;

// -----------------------------------------------------------------------------
// Houses
// -----------------------------------------------------------------------------

export const HOUSES: House[] = [
  {
    id: 1,
    name: "Builders Guild",
    description:
      "Ship code, build products, move fast. We believe in creating tangible value through technology.",
    memberCount: 28,
    treasuryBalance: 14200,
    leader: "0x1234567890aBcDeF1234567890AbCdEf12345678",
    ideologyScores: {
      longevity: 5,
      decentralization: 7,
      builderCurator: 9,
      socialSolo: 6,
      riskTolerance: 8,
    },
    color: "#6366f1",
    emoji: "\u{1F6E0}\u{FE0F}",
  },
  {
    id: 2,
    name: "Harmony Circle",
    description:
      "Community wellness, longevity research, and sustainable living. Health is the ultimate wealth.",
    memberCount: 22,
    treasuryBalance: 8400,
    leader: "0xA1B2C3D4E5F60718293a4b5c6D7E8F9001234567",
    ideologyScores: {
      longevity: 9,
      decentralization: 5,
      builderCurator: 4,
      socialSolo: 9,
      riskTolerance: 3,
    },
    color: "#10b981",
    emoji: "\u{1F33F}",
  },
  {
    id: 3,
    name: "Sovereign Node",
    description:
      "Decentralization maximalists. Privacy, autonomy, and self-sovereignty are non-negotiable.",
    memberCount: 18,
    treasuryBalance: 22100,
    leader: "0x9876FeDcBa0987654321FeDcBa09876543210000",
    ideologyScores: {
      longevity: 6,
      decentralization: 10,
      builderCurator: 7,
      socialSolo: 3,
      riskTolerance: 7,
    },
    color: "#f59e0b",
    emoji: "\u{1F6E1}\u{FE0F}",
  },
  {
    id: 4,
    name: "Culture Lab",
    description:
      "Art, curation, social experiments, and cultural innovation. We shape the vibe.",
    memberCount: 15,
    treasuryBalance: 5800,
    leader: "0xCaFeBaBe00112233445566778899AaBbCcDdEeFf",
    ideologyScores: {
      longevity: 4,
      decentralization: 6,
      builderCurator: 3,
      socialSolo: 8,
      riskTolerance: 6,
    },
    color: "#ec4899",
    emoji: "\u{1F3A8}",
  },
];

// -----------------------------------------------------------------------------
// Members (by house)
// -----------------------------------------------------------------------------

export const MEMBERS: Record<number, Member[]> = {
  // Builders Guild
  1: [
    { address: CURRENT_USER_ADDRESS, joinedAt: "2025-09-15T08:00:00Z", stakeAmount: 10 },
    { address: "0x1234567890aBcDeF1234567890AbCdEf12345678", joinedAt: "2025-08-01T12:30:00Z", stakeAmount: 25 },
    { address: "0x2B3C4D5E6F708192A3b4C5d6E7F80910a2B3c4D5", joinedAt: "2025-08-20T09:15:00Z", stakeAmount: 15 },
    { address: "0x3F4E5D6C7B8A90010203F4e5D6c7B8a900102030", joinedAt: "2025-09-02T14:45:00Z", stakeAmount: 12 },
    { address: "0x5A6B7C8D9E0F1A2B3C4D5a6b7C8d9E0f1A2b3C4D", joinedAt: "2025-10-10T11:00:00Z", stakeAmount: 8 },
    { address: "0x7E8F9A0B1C2D3E4F5A6B7e8f9A0b1C2d3E4f5A6B", joinedAt: "2025-11-05T16:20:00Z", stakeAmount: 20 },
  ],
  // Harmony Circle
  2: [
    { address: "0xA1B2C3D4E5F60718293a4b5c6D7E8F9001234567", joinedAt: "2025-07-10T10:00:00Z", stakeAmount: 30 },
    { address: "0xB2C3D4E5F6071829A3b4c5D6E7F89001a2345678", joinedAt: "2025-08-15T07:30:00Z", stakeAmount: 18 },
    { address: "0xC3D4E5F60718293aB4c5D6e7F89001A23456789a", joinedAt: "2025-09-01T13:00:00Z", stakeAmount: 10 },
    { address: "0xD4E5F60718293Ab4C5d6E7f89001a23456789AbC", joinedAt: "2025-09-22T08:45:00Z", stakeAmount: 14 },
    { address: "0xE5F60718293aB4c5D6E7F89001A23456789aBcDe", joinedAt: "2025-10-30T15:10:00Z", stakeAmount: 9 },
  ],
  // Sovereign Node
  3: [
    { address: "0x9876FeDcBa0987654321FeDcBa09876543210000", joinedAt: "2025-06-20T09:00:00Z", stakeAmount: 50 },
    { address: "0x8765FeDcBa098765432100AbCdEf1234567890aB", joinedAt: "2025-07-05T12:00:00Z", stakeAmount: 22 },
    { address: "0x7654FeDcBa0987654321AbCdEf01234567890aBc", joinedAt: "2025-08-18T10:30:00Z", stakeAmount: 16 },
    { address: "0x6543FeDcBa09876543210AbCdEf234567890aBcD", joinedAt: "2025-09-11T14:00:00Z", stakeAmount: 35 },
    { address: "0x5432FeDcBa098765432100aBcDeF34567890AbCd", joinedAt: "2025-10-25T07:15:00Z", stakeAmount: 11 },
    { address: "0x4321FeDcBa0987654321AbCdEf4567890aBcDeF0", joinedAt: "2025-12-01T18:00:00Z", stakeAmount: 8 },
  ],
  // Culture Lab
  4: [
    { address: "0xCaFeBaBe00112233445566778899AaBbCcDdEeFf", joinedAt: "2025-08-05T11:00:00Z", stakeAmount: 20 },
    { address: "0xDeAdBeEf00112233445566778899aAbBcCdDeEfF", joinedAt: "2025-08-28T09:30:00Z", stakeAmount: 12 },
    { address: "0xFaCeFeed00112233445566778899AABBccDDeeFF", joinedAt: "2025-09-14T13:45:00Z", stakeAmount: 7 },
    { address: "0xBaD00Dad00112233445566778899aaBBCCddEEff", joinedAt: "2025-10-02T16:00:00Z", stakeAmount: 15 },
    { address: "0xC0ffEE0000112233445566778899AaBbCcDdEeFf", joinedAt: "2025-11-18T08:20:00Z", stakeAmount: 5 },
  ],
};

// -----------------------------------------------------------------------------
// Proposals
// -----------------------------------------------------------------------------

export const PROPOSALS: Proposal[] = [
  // 1 — Builders Guild (active)
  {
    id: 1,
    houseId: 1,
    title: "Fund Hackathon Prize Pool",
    description:
      "Allocate 2,000 USDC from the treasury to fund prizes for our upcoming internal hackathon. Prizes will be split across three tracks: DeFi, public goods, and wildcard.",
    author: "0x1234567890aBcDeF1234567890AbCdEf12345678",
    startTime: "2026-02-25T00:00:00Z",
    endTime: "2026-03-05T00:00:00Z",
    yesVotes: 18,
    noVotes: 3,
    status: "active",
    voters: [
      { address: CURRENT_USER_ADDRESS, support: true, txHash: "0xa1b2c3d4e5f6071829304050607080901a2b3c4d5e6f071829304050607080ab" },
      { address: "0x2B3C4D5E6F708192A3b4C5d6E7F80910a2B3c4D5", support: true, txHash: "0xb2c3d4e5f60718293040506070809010a2b3c4d5e6f0718293040506070809cd" },
      { address: "0x3F4E5D6C7B8A90010203F4e5D6c7B8a900102030", support: true, txHash: "0xc3d4e5f607182930405060708090102a2b3c4d5e6f07182930405060708090ef" },
      { address: "0x5A6B7C8D9E0F1A2B3C4D5a6b7C8d9E0f1A2b3C4D", support: true, txHash: "0xd4e5f6071829304050607080901020a2b3c4d5e6f0718293040506070809abcd" },
      { address: "0x7E8F9A0B1C2D3E4F5A6B7e8f9A0b1C2d3E4f5A6B", support: false, txHash: "0xe5f60718293040506070809010203a2b3c4d5e6f07182930405060708090dead" },
      { address: "0x1234567890aBcDeF1234567890AbCdEf12345678", support: true, txHash: "0xf607182930405060708090102030a2b3c4d5e6f071829304050607080901beef" },
      { address: "0x4A5B6C7D8E9F0A1B2C3D4a5B6c7d8E9f0a1B2C3D", support: true, txHash: "0x0718293040506070809010203040a2b3c4d5e6f07182930405060708090cafe0" },
      { address: "0x6C7D8E9F0A1B2C3D4E5F6c7D8e9f0A1b2C3d4E5F", support: true, txHash: "0x1829304050607080901020304050a2b3c4d5e6f0718293040506070809012345" },
      { address: "0x8E9F0A1B2C3D4E5F6A7B8e9f0A1b2C3d4e5F6a7B", support: true, txHash: "0x2930405060708090102030405060a2b3c4d5e6f071829304050607080906789a" },
      { address: "0x0A1B2C3D4E5F6A7B8C9D0a1B2c3D4e5f6A7b8C9D", support: true, txHash: "0x3040506070809010203040506070a2b3c4d5e6f07182930405060708090bcdef" },
      { address: "0xABCD1234EF567890AB12CD34EF5678901234ABCD", support: true, txHash: "0x4050607080901020304050607080a2b3c4d5e6f07182930405060708090aabb0" },
      { address: "0xEF567890ABCD1234EF5678901234ABCDEF567890", support: true, txHash: "0x5060708090102030405060708090a2b3c4d5e6f071829304050607080901122a" },
      { address: "0x1122334455667788990011223344556677889900", support: true, txHash: "0x6070809010203040506070809010a2b3c4d5e6f07182930405060708090ccdd0" },
      { address: "0xAABBCCDDEEFF00112233445566778899AABBCCDD", support: true, txHash: "0x7080901020304050607080901020a2b3c4d5e6f07182930405060708090eeff0" },
      { address: "0x99887766554433221100FFEEDDCCBBAA99887766", support: true, txHash: "0x8090102030405060708090102030a2b3c4d5e6f071829304050607080901234a" },
      { address: "0x0011223344556677AABBCCDDEEFF001122334455", support: true, txHash: "0x9010203040506070809010203040a2b3c4d5e6f07182930405060708090567ab" },
      { address: "0x5566778899001122AABBCCDDEEFF001122334455", support: true, txHash: "0xa020304050607080901020304050a2b3c4d5e6f071829304050607080908901c" },
      { address: "0x4455667700112233AABBCCDDEEFF001122334455", support: true, txHash: "0xb030405060708090102030405060a2b3c4d5e6f07182930405060708090abcde" },
      { address: "0x6677889900112233AABBCCDDEEFF001122334455", support: false, txHash: "0xc040506070809010203040506070a2b3c4d5e6f07182930405060708090faded" },
      { address: "0x8899001122334455AABBCCDDEEFF001122334455", support: true, txHash: "0xd050607080901020304050607080a2b3c4d5e6f07182930405060708090de1e7" },
      { address: "0x2233445566778899AABBCCDDEEFF001122334455", support: false, txHash: "0xe060708090102030405060708090a2b3c4d5e6f071829304050607080900dead" },
    ],
  },

  // 2 — Harmony Circle (passed)
  {
    id: 2,
    houseId: 2,
    title: "Weekly Meditation Sessions",
    description:
      "Establish weekly guided meditation sessions for house members. Budget 200 USDC/month for a qualified facilitator and hosting costs.",
    author: "0xA1B2C3D4E5F60718293a4b5c6D7E8F9001234567",
    startTime: "2026-02-01T00:00:00Z",
    endTime: "2026-02-15T00:00:00Z",
    yesVotes: 15,
    noVotes: 4,
    status: "passed",
    voters: [
      { address: "0xA1B2C3D4E5F60718293a4b5c6D7E8F9001234567", support: true, txHash: "0x11a2b3c4d5e6f0718293040506070809010203040506070809010203040506ab" },
      { address: "0xB2C3D4E5F6071829A3b4c5D6E7F89001a2345678", support: true, txHash: "0x22b3c4d5e6f07182930405060708090102030405060708090102030405060cd" },
      { address: "0xC3D4E5F60718293aB4c5D6e7F89001A23456789a", support: true, txHash: "0x33c4d5e6f071829304050607080901020304050607080901020304050607ef01" },
      { address: "0xD4E5F60718293Ab4C5d6E7f89001a23456789AbC", support: false, txHash: "0x44d5e6f0718293040506070809010203040506070809010203040506070812ab" },
      { address: "0xE5F60718293aB4c5D6E7F89001A23456789aBcDe", support: true, txHash: "0x55e6f071829304050607080901020304050607080901020304050607081234cd" },
      { address: "0xF60718293aB4c5D6E7F89001A234567890aBcDeF", support: true, txHash: "0x66f0718293040506070809010203040506070809010203040506070809015678" },
      { address: "0x0718293aB4c5D6E7F89001A23456789aBcDeFa12", support: true, txHash: "0x77071829304050607080901020304050607080901020304050607080901789ab" },
      { address: "0x18293aB4c5D6E7F89001A234567890aBcDeF1234", support: true, txHash: "0x88182930405060708090102030405060708090102030405060708090189abcde" },
      { address: "0x293aB4c5D6E7F89001A2345678901aBcDeF12345", support: false, txHash: "0x9929304050607080901020304050607080901020304050607080901901234ef" },
      { address: "0x3aB4c5D6E7F89001A2345678901AbCdEf1234567", support: true, txHash: "0xaa30405060708090102030405060708090102030405060708090102a0abcde01" },
      { address: "0x4Bc5D6E7F89001A234567890aBcDeF12345678901", support: true, txHash: "0xbb4050607080901020304050607080901020304050607080901020b0bcdef012" },
      { address: "0x5cD6E7F89001A2345678901AbCdEf123456789012", support: true, txHash: "0xcc50607080901020304050607080901020304050607080901020c0cdef01234a" },
      { address: "0x6dE7F89001A23456789012AbCdEf1234567890123", support: true, txHash: "0xdd6070809010203040506070809010203040506070809010203d0def0123456b" },
      { address: "0x7eF89001A234567890123AbCdEf12345678901234", support: false, txHash: "0xee70809010203040506070809010203040506070809010203e0ef012345678cd" },
      { address: "0x8f9001A2345678901234AbCdEf123456789012345", support: true, txHash: "0xff8090102030405060708090102030405060708090102030f0f012345678abef" },
      { address: "0x90A1B2C3D4E5F607182930A1b2C3d4E5f6071829", support: true, txHash: "0x009010203040506070809010203040506070809010203040000123456789abcd" },
      { address: "0xA1B2C3D4E5F6071829304050A1b2C3d4E5f60718", support: true, txHash: "0x11a020304050607080901020304050607080901020304050111234567890abce" },
      { address: "0xB2C3D4E5F60718293040506070B2c3D4e5F60718", support: true, txHash: "0x22b030405060708090102030405060708090102030405060222345678901bcdf" },
      { address: "0xC3D4E5F6071829304050607080C3d4E5f6071829", support: false, txHash: "0x33c040506070809010203040506070809010203040506070333456789012cdef" },
    ],
  },

  // 3 — Sovereign Node (active)
  {
    id: 3,
    houseId: 3,
    title: "Implement Anonymous Voting",
    description:
      "Integrate ZK-proof based anonymous voting for all house proposals. Estimated development cost: 3,500 USDC for an external auditor and tooling.",
    author: "0x9876FeDcBa0987654321FeDcBa09876543210000",
    startTime: "2026-02-28T00:00:00Z",
    endTime: "2026-03-07T00:00:00Z",
    yesVotes: 12,
    noVotes: 5,
    status: "active",
    voters: [
      { address: "0x9876FeDcBa0987654321FeDcBa09876543210000", support: true, txHash: "0xaa11223344556677889900aabbccddeeff00112233445566778899aabbccddee" },
      { address: "0x8765FeDcBa098765432100AbCdEf1234567890aB", support: true, txHash: "0xbb22334455667788990011aabbccddeeff112233445566778899aabbccddeeff" },
      { address: "0x7654FeDcBa0987654321AbCdEf01234567890aBc", support: true, txHash: "0xcc33445566778899001122aabbccddeeff223344556677889900aabbccddeef0" },
      { address: "0x6543FeDcBa09876543210AbCdEf234567890aBcD", support: false, txHash: "0xdd44556677889900112233aabbccddeeff334455667788990011aabbccddeef1" },
      { address: "0x5432FeDcBa098765432100aBcDeF34567890AbCd", support: true, txHash: "0xee55667788990011223344aabbccddeeff445566778899001122aabbccddeef2" },
      { address: "0x4321FeDcBa0987654321AbCdEf4567890aBcDeF0", support: true, txHash: "0xff66778899001122334455aabbccddeeff556677889900112233aabbccddeef3" },
      { address: "0x3210FeDcBa0987654321AbCdEf567890aBcDeF01", support: false, txHash: "0x0077889900112233445566aabbccddeeff667788990011223344aabbccddeef4" },
      { address: "0x2109FeDcBa0987654321AbCdEf67890aBcDeF012", support: true, txHash: "0x118899001122334455667700aabbccddeeff778899001122334455aabbccddee" },
      { address: "0x1098FeDcBa0987654321AbCdEf7890aBcDeF0123", support: true, txHash: "0x2299001122334455667788aabbccddeeff88990011223344556677aabbccddef" },
      { address: "0x0987FeDcBa0987654321AbCdEf890aBcDeF01234", support: true, txHash: "0x3300112233445566778899aabbccddeeff990011223344556677889aabbccddf" },
      { address: "0xF876FeDcBa0987654321AbCdEf90aBcDeF012345", support: false, txHash: "0x4411223344556677889900aabbccddeeffaa00112233445566778899aabbccde" },
      { address: "0xE765FeDcBa0987654321AbCdEfa0aBcDeF012346", support: true, txHash: "0x5522334455667788990011aabbccddeeffbb11223344556677889900aabbccdf" },
      { address: "0xD654FeDcBa0987654321AbCdEfb0aBcDeF012347", support: true, txHash: "0x6633445566778899001122aabbccddeeffcc22334455667788990011aabbccde" },
      { address: "0xC543FeDcBa0987654321AbCdEfc0aBcDeF012348", support: false, txHash: "0x7744556677889900112233aabbccddeeffdd33445566778899001122aabbccdf" },
      { address: "0xB432FeDcBa0987654321AbCdEfd0aBcDeF012349", support: true, txHash: "0x8855667788990011223344aabbccddeeffee44556677889900112233aabbccde" },
      { address: "0xA321FeDcBa0987654321AbCdEfe0aBcDeF01234a", support: true, txHash: "0x9966778899001122334455aabbccddeefff055667788990011223344aabbccdf" },
      { address: "0x9210FeDcBa0987654321AbCdEff0aBcDeF01234b", support: false, txHash: "0xaa77889900112233445566aabbccddeeff006677889900112233445aabbccdde" },
    ],
  },

  // 4 — Culture Lab (passed)
  {
    id: 4,
    houseId: 4,
    title: "Community Art Gallery",
    description:
      "Create a virtual gallery showcasing member-created digital art. Budget 800 USDC for platform setup and curation rewards.",
    author: "0xCaFeBaBe00112233445566778899AaBbCcDdEeFf",
    startTime: "2026-01-20T00:00:00Z",
    endTime: "2026-02-03T00:00:00Z",
    yesVotes: 11,
    noVotes: 2,
    status: "passed",
    voters: [
      { address: "0xCaFeBaBe00112233445566778899AaBbCcDdEeFf", support: true, txHash: "0x1100aabbccddeeff00112233445566778899aabbccddeeff0011223344556677" },
      { address: "0xDeAdBeEf00112233445566778899aAbBcCdDeEfF", support: true, txHash: "0x2200bbccddeeff0011223344556677889900aabbccddeeff1122334455667788" },
      { address: "0xFaCeFeed00112233445566778899AABBccDDeeFF", support: true, txHash: "0x3300ccddeeff00112233445566778899aabb00ccddeeff2233445566778899ab" },
      { address: "0xBaD00Dad00112233445566778899aaBBCCddEEff", support: false, txHash: "0x4400ddeeff0011223344556677889900aabbcc00ddeeff334455667788990abc" },
      { address: "0xC0ffEE0000112233445566778899AaBbCcDdEeFf", support: true, txHash: "0x5500eeff00112233445566778899aabbccdd00eeff44556677889900aabb0cde" },
      { address: "0xF00dCafe00112233445566778899AaBbCcDdEeFf", support: true, txHash: "0x6600ff0011223344556677889900aabbccddeeff005566778899001122bb0def" },
      { address: "0xBeEfCafe00112233445566778899AaBbCcDdEeFf", support: true, txHash: "0x7700001122334455667788990011aabbccddeeff66778899001122334400ef01" },
      { address: "0xDeCaFBad00112233445566778899AaBbCcDdEeFf", support: true, txHash: "0x8800112233445566778899001122aabbccddeeff7788990011223344550f0123" },
      { address: "0xAceBa5e000112233445566778899AaBbCcDdEeFf", support: true, txHash: "0x99001122334455667788990011223aabbccddeeff889900112233445566012345" },
      { address: "0xBa5eBa1100112233445566778899AaBbCcDdEeFf", support: true, txHash: "0xaa0112233445566778899001122334aabbccddeeff990011223344556677abcde" },
      { address: "0xCa5caDe000112233445566778899AaBbCcDdEeFf", support: false, txHash: "0xbb01223344556677889900112233445aabbccddeeffaa001122334455667bcdef" },
      { address: "0xDa7aBa5e00112233445566778899AaBbCcDdEeFf", support: true, txHash: "0xcc0122334455667788990011223344556aabbccddeeffbb0011223344556cdef0" },
      { address: "0xFa11Bac000112233445566778899AaBbCcDdEeFf", support: true, txHash: "0xdd012233445566778899001122334455667aabbccddeeffcc001122334455def1" },
    ],
  },

  // 5 — Builders Guild (active)
  {
    id: 5,
    houseId: 1,
    title: "Upgrade Dev Infrastructure",
    description:
      "Migrate CI/CD pipelines and upgrade testing infrastructure. Estimated cost: 1,200 USDC for cloud credits and tooling licenses.",
    author: "0x2B3C4D5E6F708192A3b4C5d6E7F80910a2B3c4D5",
    startTime: "2026-03-01T00:00:00Z",
    endTime: "2026-03-08T00:00:00Z",
    yesVotes: 8,
    noVotes: 1,
    status: "active",
    voters: [
      { address: "0x2B3C4D5E6F708192A3b4C5d6E7F80910a2B3c4D5", support: true, txHash: "0xab01020304050607080910111213141516171819202122232425262728293031" },
      { address: CURRENT_USER_ADDRESS, support: true, txHash: "0xbc02030405060708091011121314151617181920212223242526272829303132" },
      { address: "0x1234567890aBcDeF1234567890AbCdEf12345678", support: true, txHash: "0xcd03040506070809101112131415161718192021222324252627282930313233" },
      { address: "0x3F4E5D6C7B8A90010203F4e5D6c7B8a900102030", support: true, txHash: "0xde04050607080910111213141516171819202122232425262728293031323334" },
      { address: "0x5A6B7C8D9E0F1A2B3C4D5a6b7C8d9E0f1A2b3C4D", support: true, txHash: "0xef05060708091011121314151617181920212223242526272829303132333435" },
      { address: "0x7E8F9A0B1C2D3E4F5A6B7e8f9A0b1C2d3E4f5A6B", support: true, txHash: "0xf006070809101112131415161718192021222324252627282930313233343536" },
      { address: "0x4A5B6C7D8E9F0A1B2C3D4a5B6c7d8E9f0a1B2C3D", support: true, txHash: "0x0107080910111213141516171819202122232425262728293031323334353637" },
      { address: "0x6C7D8E9F0A1B2C3D4E5F6c7D8e9f0A1b2C3d4E5F", support: false, txHash: "0x0208091011121314151617181920212223242526272829303132333435363738" },
      { address: "0x8E9F0A1B2C3D4E5F6A7B8e9f0A1b2C3d4e5F6a7B", support: true, txHash: "0x0309101112131415161718192021222324252627282930313233343536373839" },
    ],
  },

  // 6 — Harmony Circle (active)
  {
    id: 6,
    houseId: 2,
    title: "Longevity Research Grant",
    description:
      "Fund a 3-month research grant exploring the intersection of blockchain incentives and longevity science. Budget: 3,000 USDC.",
    author: "0xB2C3D4E5F6071829A3b4c5D6E7F89001a2345678",
    startTime: "2026-02-26T00:00:00Z",
    endTime: "2026-03-06T00:00:00Z",
    yesVotes: 10,
    noVotes: 6,
    status: "active",
    voters: [
      { address: "0xB2C3D4E5F6071829A3b4c5D6E7F89001a2345678", support: true, txHash: "0x1a0102030405060708091011121314151617181920212223242526272829abcd" },
      { address: "0xA1B2C3D4E5F60718293a4b5c6D7E8F9001234567", support: true, txHash: "0x2b0203040506070809101112131415161718192021222324252627282930bcde" },
      { address: "0xC3D4E5F60718293aB4c5D6e7F89001A23456789a", support: false, txHash: "0x3c030405060708091011121314151617181920212223242526272829303cdef0" },
      { address: "0xD4E5F60718293Ab4C5d6E7f89001a23456789AbC", support: true, txHash: "0x4d04050607080910111213141516171819202122232425262728293031def012" },
      { address: "0xE5F60718293aB4c5D6E7F89001A23456789aBcDe", support: false, txHash: "0x5e0506070809101112131415161718192021222324252627282930313ef01234" },
      { address: "0xF60718293aB4c5D6E7F89001A234567890aBcDeF", support: true, txHash: "0x6f060708091011121314151617181920212223242526272829303132f0123456" },
      { address: "0x0718293aB4c5D6E7F89001A23456789aBcDeFa12", support: true, txHash: "0x700708091011121314151617181920212223242526272829303132330123456a" },
      { address: "0x18293aB4c5D6E7F89001A234567890aBcDeF1234", support: false, txHash: "0x81080910111213141516171819202122232425262728293031323334012345bc" },
      { address: "0x293aB4c5D6E7F89001A2345678901aBcDeF12345", support: true, txHash: "0x920910111213141516171819202122232425262728293031323334350123abcd" },
      { address: "0x3aB4c5D6E7F89001A2345678901AbCdEf1234567", support: false, txHash: "0xa31011121314151617181920212223242526272829303132333435360123bcde" },
      { address: "0x4Bc5D6E7F89001A234567890aBcDeF12345678901", support: true, txHash: "0xb41112131415161718192021222324252627282930313233343536370123cdef" },
      { address: "0x5cD6E7F89001A2345678901AbCdEf123456789012", support: true, txHash: "0xc51213141516171819202122232425262728293031323334353637380123def0" },
      { address: "0x6dE7F89001A23456789012AbCdEf1234567890123", support: false, txHash: "0xd613141516171819202122232425262728293031323334353637383901234ef0" },
      { address: "0x7eF89001A234567890123AbCdEf12345678901234", support: true, txHash: "0xe71415161718192021222324252627282930313233343536373839400123f012" },
      { address: "0x8f9001A2345678901234AbCdEf123456789012345", support: true, txHash: "0xf81516171819202122232425262728293031323334353637383940410124abcd" },
      { address: "0x90A1B2C3D4E5F607182930A1b2C3d4E5f6071829", support: false, txHash: "0x091617181920212223242526272829303132333435363738394041420124bcde" },
    ],
  },

  // 7 — Sovereign Node (passed)
  {
    id: 7,
    houseId: 3,
    title: "Privacy Toolkit Funding",
    description:
      "Allocate 4,000 USDC to develop and distribute a privacy toolkit including encrypted messaging guides, VPN recommendations, and wallet hygiene best practices.",
    author: "0x8765FeDcBa098765432100AbCdEf1234567890aB",
    startTime: "2026-01-15T00:00:00Z",
    endTime: "2026-01-29T00:00:00Z",
    yesVotes: 14,
    noVotes: 3,
    status: "passed",
    voters: [
      { address: "0x8765FeDcBa098765432100AbCdEf1234567890aB", support: true, txHash: "0xf1a2b3c4d5e6f7089a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3" },
      { address: "0x9876FeDcBa0987654321FeDcBa09876543210000", support: true, txHash: "0xf2b3c4d5e6f70809a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f" },
      { address: "0x7654FeDcBa0987654321AbCdEf01234567890aBc", support: true, txHash: "0xf3c4d5e6f708091a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4" },
      { address: "0x6543FeDcBa09876543210AbCdEf234567890aBcD", support: true, txHash: "0xf4d5e6f7080910a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f45" },
      { address: "0x5432FeDcBa098765432100aBcDeF34567890AbCd", support: false, txHash: "0xf5e6f708091011a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f456" },
      { address: "0x4321FeDcBa0987654321AbCdEf4567890aBcDeF0", support: true, txHash: "0xf6f70809101112a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f467" },
      { address: "0x3210FeDcBa0987654321AbCdEf567890aBcDeF01", support: true, txHash: "0xf7080910111213a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f478" },
      { address: "0x2109FeDcBa0987654321AbCdEf67890aBcDeF012", support: true, txHash: "0xf8091011121314a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f489" },
      { address: "0x1098FeDcBa0987654321AbCdEf7890aBcDeF0123", support: true, txHash: "0xf9101112131415a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f49a" },
      { address: "0x0987FeDcBa0987654321AbCdEf890aBcDeF01234", support: false, txHash: "0xfa111213141516a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4ab" },
      { address: "0xF876FeDcBa0987654321AbCdEf90aBcDeF012345", support: true, txHash: "0xfb121314151617a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4bc" },
      { address: "0xE765FeDcBa0987654321AbCdEfa0aBcDeF012346", support: true, txHash: "0xfc131415161718a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4cd" },
      { address: "0xD654FeDcBa0987654321AbCdEfb0aBcDeF012347", support: true, txHash: "0xfd141516171819a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4de" },
      { address: "0xC543FeDcBa0987654321AbCdEfc0aBcDeF012348", support: true, txHash: "0xfe151617181920a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4ef" },
      { address: "0xB432FeDcBa0987654321AbCdEfd0aBcDeF012349", support: true, txHash: "0xff161718192021a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4f0" },
      { address: "0xA321FeDcBa0987654321AbCdEfe0aBcDeF01234a", support: false, txHash: "0x00171819202122a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f401" },
      { address: "0x9210FeDcBa0987654321AbCdEff0aBcDeF01234b", support: true, txHash: "0x01181920212223a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f412" },
    ],
  },

  // 8 — Culture Lab (failed)
  {
    id: 8,
    houseId: 4,
    title: "Open Mic Night Budget",
    description:
      "Request 500 USDC for monthly open mic nights, including streaming setup, guest speaker fees, and promotional materials.",
    author: "0xDeAdBeEf00112233445566778899aAbBcCdDeEfF",
    startTime: "2026-02-10T00:00:00Z",
    endTime: "2026-02-24T00:00:00Z",
    yesVotes: 4,
    noVotes: 9,
    status: "failed",
    voters: [
      { address: "0xDeAdBeEf00112233445566778899aAbBcCdDeEfF", support: true, txHash: "0xa0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f90ab" },
      { address: "0xCaFeBaBe00112233445566778899AaBbCcDdEeFf", support: false, txHash: "0xb1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f90abc1" },
      { address: "0xFaCeFeed00112233445566778899AABBccDDeeFF", support: true, txHash: "0xc2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f90abcd2" },
      { address: "0xBaD00Dad00112233445566778899aaBBCCddEEff", support: false, txHash: "0xd3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f90abcde3f" },
      { address: "0xC0ffEE0000112233445566778899AaBbCcDdEeFf", support: false, txHash: "0xe4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f90abcdef4ab" },
      { address: "0xF00dCafe00112233445566778899AaBbCcDdEeFf", support: false, txHash: "0xf5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f90abcdef5abcd" },
      { address: "0xBeEfCafe00112233445566778899AaBbCcDdEeFf", support: false, txHash: "0xa6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f90abcdef6abcde0" },
      { address: "0xDeCaFBad00112233445566778899AaBbCcDdEeFf", support: true, txHash: "0xb7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f90abcdef7abcdef12" },
      { address: "0xAceBa5e000112233445566778899AaBbCcDdEeFf", support: false, txHash: "0xc8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f90abcdef8abcdef2345" },
      { address: "0xBa5eBa1100112233445566778899AaBbCcDdEeFf", support: false, txHash: "0xd9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f90abcdef9abcdef345678" },
      { address: "0xCa5caDe000112233445566778899AaBbCcDdEeFf", support: false, txHash: "0xe0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f90abcdefa0abcdef45678901" },
      { address: "0xDa7aBa5e00112233445566778899AaBbCcDdEeFf", support: true, txHash: "0xf1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f90abcdefb0abcdef567890abcd" },
      { address: "0xFa11Bac000112233445566778899AaBbCcDdEeFf", support: false, txHash: "0xa2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f90abcdefc0abcdef6789012345ef" },
    ],
  },
];

// -----------------------------------------------------------------------------
// Helper Functions
// -----------------------------------------------------------------------------

export function getHouseById(id: number): House | undefined {
  return HOUSES.find((house) => house.id === id);
}

export function getProposalsByHouse(houseId: number): Proposal[] {
  return PROPOSALS.filter((proposal) => proposal.houseId === houseId);
}

export function getProposalById(id: number): Proposal | undefined {
  return PROPOSALS.find((proposal) => proposal.id === id);
}

// Aliases for convenience
export const houses = HOUSES;
export const proposals = PROPOSALS;

export function getMembersByHouse(houseId: number): Member[] {
  return MEMBERS[houseId] ?? [];
}
