import { ethers, network } from "hardhat";
import * as fs from "fs";
import * as path from "path";

// Real USDC address on Base mainnet
const BASE_MAINNET_USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

// Default stake: 10 USDC (6 decimals)
const STAKE_AMOUNT = 10n * 10n ** 6n;

// The four default houses
const DEFAULT_HOUSES = [
  {
    name: "House of Science & Technology",
    description:
      "Focused on scientific research, technological innovation, and evidence-based policy.",
  },
  {
    name: "House of Economy & Finance",
    description:
      "Focused on economic policy, fiscal responsibility, and financial systems.",
  },
  {
    name: "House of Society & Culture",
    description:
      "Focused on social welfare, cultural preservation, education, and public health.",
  },
  {
    name: "House of Environment & Infrastructure",
    description:
      "Focused on environmental protection, sustainable development, and public infrastructure.",
  },
];

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log(
    "Account balance:",
    ethers.formatEther(await ethers.provider.getBalance(deployer.address)),
    "ETH"
  );

  // ---------------------------------------------------------------
  // 1. USDC — deploy mock on testnets, use real on mainnet
  // ---------------------------------------------------------------
  let usdcAddress: string;

  if (network.name === "base") {
    usdcAddress = BASE_MAINNET_USDC;
    console.log("Using real USDC on Base mainnet:", usdcAddress);
  } else {
    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    const mockUsdc = await MockUSDC.deploy();
    await mockUsdc.waitForDeployment();
    usdcAddress = await mockUsdc.getAddress();
    console.log("MockUSDC deployed to:", usdcAddress);
  }

  // ---------------------------------------------------------------
  // 2. HouseRegistry
  // ---------------------------------------------------------------
  const HouseRegistry = await ethers.getContractFactory("HouseRegistry");
  const registry = await HouseRegistry.deploy(usdcAddress, STAKE_AMOUNT);
  await registry.waitForDeployment();
  const registryAddress = await registry.getAddress();
  console.log("HouseRegistry deployed to:", registryAddress);

  // ---------------------------------------------------------------
  // 3. HouseVoting
  // ---------------------------------------------------------------
  const HouseVoting = await ethers.getContractFactory("HouseVoting");
  const voting = await HouseVoting.deploy(registryAddress);
  await voting.waitForDeployment();
  const votingAddress = await voting.getAddress();
  console.log("HouseVoting deployed to:", votingAddress);

  // ---------------------------------------------------------------
  // 4. HouseTreasury
  // ---------------------------------------------------------------
  const HouseTreasury = await ethers.getContractFactory("HouseTreasury");
  const treasury = await HouseTreasury.deploy(
    registryAddress,
    votingAddress,
    usdcAddress
  );
  await treasury.waitForDeployment();
  const treasuryAddress = await treasury.getAddress();
  console.log("HouseTreasury deployed to:", treasuryAddress);

  // ---------------------------------------------------------------
  // 5. Authorize HouseTreasury as a proposal creator in HouseVoting
  // ---------------------------------------------------------------
  const authTx = await voting.setAuthorizedCaller(treasuryAddress, true);
  await authTx.wait();
  console.log("HouseTreasury authorized as proposal creator in HouseVoting");

  // ---------------------------------------------------------------
  // 6. Create default houses
  // ---------------------------------------------------------------
  console.log("\nCreating default houses...");
  for (const house of DEFAULT_HOUSES) {
    const tx = await registry.createHouse(house.name, house.description);
    await tx.wait();
    console.log(`  Created: ${house.name}`);
  }

  // ---------------------------------------------------------------
  // 7. Write deployed addresses to JSON
  // ---------------------------------------------------------------
  const addresses = {
    network: network.name,
    chainId: (await ethers.provider.getNetwork()).chainId.toString(),
    deployer: deployer.address,
    contracts: {
      usdc: usdcAddress,
      houseRegistry: registryAddress,
      houseVoting: votingAddress,
      houseTreasury: treasuryAddress,
    },
    deployedAt: new Date().toISOString(),
  };

  const outputPath = path.join(__dirname, "..", "deployed-addresses.json");
  fs.writeFileSync(outputPath, JSON.stringify(addresses, null, 2));
  console.log(`\nAddresses written to ${outputPath}`);

  console.log("\n--- Deployment Summary ---");
  console.log(`  USDC:           ${usdcAddress}`);
  console.log(`  HouseRegistry:  ${registryAddress}`);
  console.log(`  HouseVoting:    ${votingAddress}`);
  console.log(`  HouseTreasury:  ${treasuryAddress}`);
  console.log("--------------------------\n");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
