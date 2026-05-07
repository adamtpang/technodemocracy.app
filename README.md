# technodemocracy.app

> _From magical internet money to magical internet votes._
>
> An implementation of Balaji Srinivasan's [technodemocracy spec](./transcript.md) — digital political parties with binding, scoped, OAuth-style franchise grants. Built on Base.

## What it is

Each "party" is a binding social smart contract. Joining grants the party president a **cryptographically scoped franchise** over your wallet — annual dues, slashable stake, delegated voting weight, follow-the-slate. Like Google OAuth, but for political parties.

- **Universal candidacy.** Any wallet may found a party.
- **Universal franchise.** Any wallet may grant the franchise to any party.
- **Streaming votes.** Every vote registers onchain the moment it's cast.
- **Provably limited government.** The president can never exceed the slashing cap, the dues amount, or the registered delegated voting weight.
- **Soulbound vote receipts.** Every vote mints an "I Voted" NFT — verifiable on Basescan, can't be sold.
- **Bidirectional with the real world.** NFT-gated doors, drones, and infrastructure.

## The 12-contract suite (`/contracts`)

Solidity 0.8.27, Cancun EVM, viaIR, OpenZeppelin v5.

| Contract | Role |
|---|---|
| **PartyRegistry** | Universal candidacy; party metadata + president |
| **NormsRegistry** | Versioned norms with content hashes |
| **MembershipNFT** | Soulbound; minted on franchise grant, burned on revoke |
| **Franchise** | Typed Scope enum; per-scope revoke; provably bounded slashing |
| **Cabinet** | Typed Power enum; digital delegation |
| **DisputeResolver** | Binding verdicts; gates `slashMember` |
| **IVotedNFT** | Soulbound on-chain SVG vote receipts |
| **Voting** | Streaming votes + delegated weight |
| **Election** | Periodic president elections (365-day term) |
| **Treasury** | 3 spend lanes: small / voted / 2-of-N emergency |
| **Census** | Soulbound proof-of-attendance / proof-of-residence stamps |
| **AccessGate** | Bidirectional NFT-gated real-world access (Chainlink hook) |

10 end-to-end Hardhat tests covering every flow from the transcript.

## Frontend (`/src`)

Next.js 14 (App Router), TypeScript, Tailwind, RainbowKit + wagmi (Base + Base Sepolia).

Routes:

```
/                                    landing + legitimacy meter
/parties                             search/sort/filter
/parties/[id]                        Twitter/Farcaster-style party page
/parties/[id]/dashboard              president-only: cabinet, norms, disputes, treasury
/parties/[id]/election               streaming election or past results
/parties/[id]/proposals/[pid]        vote + I Voted NFT mint screen
/parties/[id]/proposals/new
/parties/new                         universal candidacy form
/feed                                global Twitter-like activity stream
/profile                             multi-party franchises + NFT collection
/join-quiz                           ideology quiz → party match
```

## Run locally

```bash
# Frontend
pnpm install
pnpm dev

# Contracts
cd contracts
pnpm install
pnpm compile
pnpm test
```

## Deploy contracts (Base Sepolia)

```bash
cd contracts
cp ../.env.example ../.env  # set DEPLOYER_PRIVATE_KEY + BASE_SEPOLIA_RPC_URL
pnpm deploy:sepolia
```

Addresses are written to `contracts/deployed-addresses.json`.

## Sister project

[interneta.world](https://interneta.world) — the network state.

---

_The financial crisis of 2008 motivated cryptocurrency. The political crisis of 2024 motivates technodemocracy._
