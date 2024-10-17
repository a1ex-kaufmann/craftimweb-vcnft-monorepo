import { HardhatUserConfig } from "hardhat/types";
import { task } from "hardhat/config";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "@nomicfoundation/hardhat-verify";
import "@openzeppelin/hardhat-upgrades";
import "@nomicfoundation/hardhat-chai-matchers";
import { config as dotEnvConfig } from "dotenv";
import "hardhat-gas-reporter";
import "hardhat-storage-layout";
import "hardhat-tracer";
import "hardhat-contract-sizer";
import "hardhat-abi-exporter";
import "solidity-coverage";

import "./scripts/tasks";

dotEnvConfig();

const NO_PRIVATE = "0x0000000000000000000000000000000000000000000000000000000000000000";

const ETHEREUM_RPC_URL = process.env.ETHEREUM_RPC_URL || "";
const RINKEBY_TESTNET_RPC_URL = process.env.RINKEBY_TESTNET_RPC_URL || "";
const ROPSTEN_TESTNET_RPC_URL = process.env.ROPSTEN_TESTNET_RPC_URL || "";
const GOERLI_TESTNET_RPC_URL = process.env.GOERLI_TESTNET_RPC_URL || "";
const SEPOLIA_TESTNET_RPC_URL = process.env.SEPOLIA_TESTNET_RPC_URL || "";
const POLYGON_RPC_URL = process.env.POLYGON_RPC_URL || "";
const POLYGON_TESTNET_RPC_URL = process.env.POLYGON_TESTNET_RPC_URL || "";
const BSC_RPC_URL = process.env.BSC_RPC_URL || "";
const BSC_TESTNET_RPC_URL = process.env.BSC_TESTNET_RPC_URL || "";
const AVALANCHE_RPC_URL = process.env.AVALANCHE_RPC_URL || "";
const AVALANCHE_TESTNET_RPC_URL = process.env.AVALANCHE_TESTNET_RPC_URL || "";
const GNOSIS_RPC_URL = process.env.GNOSIS_RPC_URL || "";
const GNOSIS_TESTNET_RPC_URL = process.env.GNOSIS_TESTNET_RPC_URL || "";
const OPTIMISM_RPC_URL = process.env.OPTIMISM_RPC_URL || "";
const OPTIMISM_TESTNET_RPC_URL = process.env.AVALANCHE_TESTNET_RPC_URL || "";
const ARBITRUM_RPC_URL = process.env.ARBITRUM_RPC_URL || "";
const ARBITRUM_TESTNET_RPC_URL = process.env.ARBITRUM_TESTNET_RPC_URL || "";
const AURORA_RPC_URL = process.env.AURORA_RPC_URL || "";
const AURORA_TESTNET_RPC_URL = process.env.AURORA_TESTNET_RPC_URL || "";
const FANTOM_RPC_URL = process.env.FANTOM_RPC_URL || "";
const FANTOM_TESTNET_RPC_URL = process.env.FANTOM_TESTNET_RPC_URL || "";
const CELO_RPC_URL = process.env.CELO_RPC_URL || "";
const CELO_TESTNET_RPC_URL = process.env.CELO_TESTNET_RPC_URL || "";
const POLYGON_ZKEVM_RPC_URL = process.env.POLYGON_ZKEVM_RPC_URL || "";
const POLYGON_ZKEVM_TESTNET_RPC_URL = process.env.POLYGON_ZKEVM_TESTNET_RPC_URL || "";
const BASE_RPC_URL = process.env.BASE_RPC_URL || "";
const BASE_TESTNET_RPC_URL = process.env.BASE_TESTNET_RPC_URL || "";
const SCROLL_RPC_URL = process.env.SCROLL_RPC_URL || "";
const SCROLL_TESTNET_RPC_URL = process.env.SCROLL_TESTNET_RPC_URL || "";
const MOONBEAM_RPC_URL = process.env.MOONBEAM_RPC_URL || "";
const MOONBEAM_TESTNET_RPC_URL = process.env.MOONBEAM_TESTNET_RPC_URL || "";
const MANTA_RPC_URL = process.env.MANTA_RPC_URL || "";
const MANTA_TESTNET_RPC_URL = process.env.MANTA_TESTNET_RPC_URL || "";
const ZETACHAIN_RPC_URL = process.env.ZETACHAIN_RPC_URL || "";
const ZETACHAIN_TESTNET_RPC_URL = process.env.ZETACHAIN_TESTNET_RPC_URL || "";
const VICTION_RPC_URL = process.env.VICTION_RPC_URL || "";
const VICTION_TESTNET_RPC_URL = process.env.VICTION_TESTNET_RPC_URL || "";
const LINEA_RPC_URL = process.env.LINEA_RPC_URL || "";
const LINEA_TESTNET_RPC_URL = process.env.LINEA_TESTNET_RPC_URL || "";
const BLAST_RPC_URL = process.env.BLAST_RPC_URL || "";
const BLAST_TESTNET_RPC_URL = process.env.BLAST_TESTNET_RPC_URL || "";
const SEI_RPC_URL = process.env.SEI_RPC_URL || "";
const SEI_TESTNET_RPC_URL = process.env.SEI_TESTNET_RPC_URL || "";
const MODE_RPC_URL = process.env.MODE_RPC_URL || "";
const MODE_TESTNET_RPC_URL = process.env.MODE_TESTNET_RPC_URL || "";
const INEVM_RPC_URL = process.env.INEVM_RPC_URL || "";
const INEVM_TESTNET_RPC_URL = process.env.INEVM_TESTNET_RPC_URL || "";
const FRAX_RPC_URL = process.env.FRAX_RPC_URL || "";
const FRAX_TESTNET_RPC_URL = process.env.FRAX_TESTNET_RPC_URL || "";
const REDSTONE_RPC_URL = process.env.REDSTONE_RPC_URL || "";
const REDSTONE_TESTNET_RPC_URL = process.env.REDSTONE_TESTNET_RPC_URL || "";
const TAIKO_RPC_URL = process.env.TAIKO_RPC_URL || "";
const TAIKO_TESTNET_RPC_URL = process.env.TAIKO_TESTNET_RPC_URL || "";
const ANCIENT8_RPC_URL = process.env.ANCIENT8_RPC_URL || "";
const ANCIENT8_TESTNET_RPC_URL = process.env.ANCIENT8_TESTNET_RPC_URL || "";
const ZORA_RPC_URL = process.env.ZORA_RPC_URL || "";
const ZORA_TESTNET_RPC_URL = process.env.ZORA_TESTNET_RPC_URL || "";
const FUSE_RPC_URL = process.env.FUSE_RPC_URL || "";
const FUSE_TESTNET_RPC_URL = process.env.FUSE_TESTNET_RPC_URL || "";
const MANTLE_RPC_URL = process.env.MANTLE_RPC_URL || "";
const MANTLE_TESTNET_RPC_URL = process.env.MANTLE_TESTNET_RPC_URL || "";
const BOB_RPC_URL = process.env.BOB_RPC_URL || "";
const BOB_TESTNET_RPC_URL = process.env.BOB_TESTNET_RPC_URL || "";
const XLAYER_RPC_URL = process.env.XLAYER_RPC_URL || "";
const XLAYER_TESTNET_RPC_URL = process.env.XLAYER_TESTNET_RPC_URL || "";
const ENDURANCE_RPC_URL = process.env.ENDURANCE_RPC_URL || "";
const ENDURANCE_TESTNET_RPC_URL = process.env.ENDURANCE_TESTNET_RPC_URL || "";
const FORMA_RPC_URL = process.env.FORMA_RPC_URL || "";
const FORMA_TESTNET_RPC_URL = process.env.FORMA_TESTNET_RPC_URL || "";
const WORLDCHAIN_RPC_URL = process.env.WORLDCHAIN_RPC_URL || "";
const WORLDCHAIN_TESTNET_RPC_URL = process.env.WORLDCHAIN_TESTNET_RPC_URL || "";
const ZIRCUIT_RPC_URL = process.env.ZIRCUIT_RPC_URL || "";
const ZIRCUIT_TESTNET_RPC_URL = process.env.ZIRCUIT_TESTNET_RPC_URL || "";
const SUPERPOSITION_RPC_URL = process.env.SUPERPOSITION_RPC_URL || "";
const SUPERPOSITION_TESTNET_RPC_URL = process.env.SUPERPOSITION_TESTNET_RPC_URL || "";
const MINT_RPC_URL = process.env.MINT_RPC_URL || "";
const MINT_TESTNET_RPC_URL = process.env.MINT_TESTNET_RPC_URL || "";
const REAL_RPC_URL = process.env.REAL_RPC_URL || "";
const REAL_TESTNET_RPC_URL = process.env.REAL_TESTNET_RPC_URL || "";
const BITLAYER_RPC_URL = process.env.BITLAYER_RPC_URL || "";
const BITLAYER_TESTNET_RPC_URL = process.env.BITLAYER_TESTNET_RPC_URL || "";
const MERLIN_RPC_URL = process.env.MERLIN_RPC_URL || "";
const MERLIN_TESTNET_RPC_URL = process.env.MERLIN_TESTNET_RPC_URL || "";
const FLARE_RPC_URL = process.env.FLARE_RPC_URL || "";
const FLARE_TESTNET_RPC_URL = process.env.FLARE_TESTNET_RPC_URL || "";

const ETHEREUM_EXPLORER_API_KEY = process.env.ETHEREUM_EXPLORER_API_KEY || "";
const POLYGON_EXPLORER_API_KEY = process.env.POLYGON_EXPLORER_API_KEY || "";
const BSC_EXPLORER_API_KEY = process.env.BSC_EXPLORER_API_KEY || "";
const AVALANCHE_EXPLORER_API_KEY = process.env.AVALANCHE_EXPLORER_API_KEY || "";
const GNOSIS_EXPLORER_API_KEY = process.env.GNOSIS_EXPLORER_API_KEY || "";
const OPTIMISM_EXPLORER_API_KEY = process.env.OPTIMISM_EXPLORER_API_KEY || "";
const ARBITRUM_EXPLORER_API_KEY = process.env.ARBITRUM_EXPLORER_API_KEY || "";
const AURORA_EXPLORER_API_KEY = process.env.AURORA_EXPLORER_API_KEY || "";
const FANTOM_EXPLORER_API_KEY = process.env.FANTOM_EXPLORER_API_KEY || "";
const CELO_EXPLORER_API_KEY = process.env.CELO_EXPLORER_API_KEY || "";
const POLYGON_ZKEVM_EXPLORER_API_KEY = process.env.POLYGON_ZKEVM_EXPLORER_API_KEY || "";
const BASE_EXPLORER_API_KEY = process.env.BASE_EXPLORER_API_KEY || "";
const SCROLL_EXPLORER_API_KEY = process.env.SCROLL_EXPLORER_API_KEY || "";
const MOONBEAM_EXPLORER_API_KEY = process.env.MOONBEAM_EXPLORER_API_KEY || "";
const MANTA_EXPLORER_API_KEY = process.env.MANTA_EXPLORER_API_KEY || "";
const ZETACHAIN_EXPLORER_API_KEY = process.env.ZETACHAIN_EXPLORER_API_KEY || "";
const VICTION_EXPLORER_API_KEY = process.env.VICTION_EXPLORER_API_KEY || "";
const LINEA_EXPLORER_API_KEY = process.env.LINEA_EXPLORER_API_KEY || "";
const BLAST_EXPLORER_API_KEY = process.env.BLAST_EXPLORER_API_KEY || "";
const SEI_EXPLORER_API_KEY = process.env.SEI_EXPLORER_API_KEY || "";
const MODE_EXPLORER_API_KEY = process.env.MODE_EXPLORER_API_KEY || "";
const INEVM_EXPLORER_API_KEY = process.env.INEVM_EXPLORER_API_KEY || "";
const FRAX_EXPLORER_API_KEY = process.env.FRAX_EXPLORER_API_KEY || "";
const REDSTONE_EXPLORER_API_KEY = process.env.REDSTONE_EXPLORER_API_KEY || "";
const TAIKO_EXPLORER_API_KEY = process.env.TAIKO_EXPLORER_API_KEY || "";
const ANCIENT8_EXPLORER_API_KEY = process.env.ANCIENT8_EXPLORER_API_KEY || "";
const ZORA_EXPLORER_API_KEY = process.env.ZORA_EXPLORER_API_KEY || "";
const FUSE_EXPLORER_API_KEY = process.env.FUSE_EXPLORER_API_KEY || "";
const MANTLE_EXPLORER_API_KEY = process.env.MANTLE_EXPLORER_API_KEY || "";
const BOB_EXPLORER_API_KEY = process.env.BOB_EXPLORER_API_KEY || "";
const XLAYER_EXPLORER_API_KEY = process.env.XLAYER_EXPLORER_API_KEY || "";
const ENDURANCE_EXPLORER_API_KEY = process.env.ENDURANCE_EXPLORER_API_KEY || "";
const FORMA_EXPLORER_API_KEY = process.env.FORMA_EXPLORER_API_KEY || "";
const WORLDCHAIN_EXPLORER_API_KEY = process.env.WORLDCHAIN_EXPLORER_API_KEY || "";
const ZIRCUIT_EXPLORER_API_KEY = process.env.ZIRCUIT_EXPLORER_API_KEY || "";
const SUPERPOSITION_EXPLORER_API_KEY = process.env.SUPERPOSITION_EXPLORER_API_KEY || "";
const MINT_EXPLORER_API_KEY = process.env.MINT_EXPLORER_API_KEY || "";
const FLARE_EXPLORER_API_KEY = process.env.FLARE_EXPLORER_API_KEY || "";
const MERLIN_EXPLORER_API_KEY = process.env.MERLIN_EXPLORER_API_KEY || "";
const BITLAYER_EXPLORER_API_KEY = process.env.BITLAYER_EXPLORER_API_KEY || "";
const REAL_EXPLORER_API_KEY = process.env.REAL_EXPLORER_API_KEY || "";

const SIGNER_PRIVATE_KEY = process.env.SIGNER_PRIVATE_KEY || NO_PRIVATE;

task("accounts", "Prints accounts and their balances", async (_, { ethers }) => {
  const accounts = await ethers.getSigners();

  let balance;
  for (const account of accounts) {
    balance = await ethers.provider.getBalance(account.address);
    console.log(account.address + ":", balance.toString());
  }
});

const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      // accounts: [{
      //   privateKey: SIGNER_PRIVATE_KEY,
      //   balance: "10000000000000000000000",
      // }],
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      // accounts: [SIGNER_PRIVATE_KEY],
    },
    eth: {
      url: ETHEREUM_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 1,
    },
    rinkeby: {
      url: RINKEBY_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 4,
    },
    ropsten: {
      url: ROPSTEN_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 3,
    },
    goerli: {
      url: GOERLI_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 5,
    },
    sepolia: {
      url: SEPOLIA_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 11155111,
    },
    polygon: {
      url: POLYGON_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 137,
    },
    polygonTestnet: {
      url: POLYGON_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 80001,
    },
    bsc: {
      url: BSC_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 56,
    },
    bscTestnet: {
      url: BSC_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 97,
    },
    avax: {
      url: AVALANCHE_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 43114,
    },
    avaxTestnet: {
      url: AVALANCHE_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 43113,
    },
    gnosis: {
      url: GNOSIS_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 100,
    },
    gnosisTestnet: {
      url: GNOSIS_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 10200,
    },
    optimism: {
      url: OPTIMISM_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 10,
    },
    optimismTestnet: {
      url: OPTIMISM_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 11155420,
    },
    arbitrum: {
      url: ARBITRUM_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 42161,
    },
    arbitrumTestnet: {
      url: ARBITRUM_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 421614,
    },
    aurora: {
      url: AURORA_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 1313161554,
    },
    auroraTestnet: {
      url: AURORA_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 1313161555,
    },
    fantom: {
      url: FANTOM_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 250,
    },
    fantomTestnet: {
      url: FANTOM_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 4002,
    },
    celo: {
      url: CELO_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 42220,
    },
    celoTestnet: {
      url: CELO_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 44787,
    },
    polygonZkevm: {
      url: POLYGON_ZKEVM_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 1101,
    },
    polygonZkevmTestnet: {
      url: POLYGON_ZKEVM_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 1442,
    },
    base: {
      url: BASE_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 8453,
    },
    baseTestnet: {
      url: BASE_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 84532,
    },
    scroll: {
      url: SCROLL_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      gasPrice: 250000000,
      chainId: 534352,
    },
    scrollTestnet: {
      url: SCROLL_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 534351,
    },
    moonbeam: {
      url: MOONBEAM_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 1284,
    },
    moonbeamTestnet: {
      url: MOONBEAM_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 1287,
    },
    manta: {
      url: MANTA_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 169,
    },
    mantaTestnet: {
      url: MANTA_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 3441006,
    },
    zetachain: {
      url: ZETACHAIN_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 7000,
    },
    zetachainTestnet: {
      url: ZETACHAIN_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 7001,
    },
    viction: {
      url: VICTION_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 88,
    },
    victionTestnet: {
      url: VICTION_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 89,
    },
    linea: {
      url: LINEA_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 59144,
    },
    lineaTestnet: {
      url: LINEA_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 59141,
    },
    blast: {
      url: BLAST_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 81457,
    },
    blastTestnet: {
      url: BLAST_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 0,
    },
    sei: {
      url: SEI_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 1329,
    },
    seiTestnet: {
      url: SEI_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 1328,
    },
    mode: {
      url: MODE_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 34443,
    },
    modeTestnet: {
      url: MODE_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 919,
    },
    inevm: {
      url: INEVM_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 2525,
    },
    inevmTestnet: {
      url: INEVM_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 0,
    },
    fraxtal: {
      url: FRAX_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 252,
    },
    fraxtalTestnet: {
      url: FRAX_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 2522,
    },
    redstone: {
      url: REDSTONE_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 690,
    },
    redstoneTestnet: {
      url: REDSTONE_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 0,
    },
    taiko: {
      url: TAIKO_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 167000,
    },
    taikoTestnet: {
      url: TAIKO_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 167009,
    },
    ancient8: {
      url: ANCIENT8_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 888888888,
    },
    ancient8Testnet: {
      url: ANCIENT8_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 28122024,
    },
    zora: {
      url: ZORA_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 7777777,
    },
    zoraTestnet: {
      url: ZORA_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 0,
    },
    fuse: {
      url: FUSE_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 122,
      gasPrice: 25000000000
    },
    fuseTestnet: {
      url: FUSE_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 123,
    },
    mantle: {
      url: MANTLE_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      // gasPrice: 330000000,
      chainId: 5000,
    },
    mantleTestnet: {
      url: MANTLE_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 0,
    },
    bob: {
      url: BOB_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 60808,
    },
    bobTestnet: {
      url: BOB_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 0,
    },
    xlayer: {
      url: XLAYER_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 196,
    },
    xlayerTestnet: {
      url: XLAYER_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 0,
    },
    endurance: {
      url: ENDURANCE_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 648,
    },
    enduranceTestnet: {
      url: ENDURANCE_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 0,
    },
    forma: {
      url: FORMA_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 984122,
    },
    formaTestnet: {
      url: FORMA_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 0,
    },
    worldchain: {
      url: WORLDCHAIN_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 480,
    },
    worldchainTestnet: {
      url: WORLDCHAIN_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 0,
    },
    zircuit: {
      url: ZIRCUIT_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 48900,
    },
    zircuitTestnet: {
      url: ZIRCUIT_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 0,
    },
    superposition: {
      url: SUPERPOSITION_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 0,
    },
    superpositionTestnet: {
      url: SUPERPOSITION_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 0,
    },
    mint: {
      url: MINT_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 185,
    },
    mintTestnet: {
      url: MINT_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 0,
    },
    real: {
      url: REAL_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 111188,
    },
    realTestnet: {
      url: REAL_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 0,
    },
    bitlayer: {
      url: BITLAYER_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 200901,
    },
    bitlayerTestnet: {
      url: BITLAYER_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 0,
    },
    merlin: {
      url: MERLIN_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 4200,
    },
    merlinTestnet: {
      url: MERLIN_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 0,
    },
    flare: {
      url: FLARE_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 14,
    },
    flareTestnet: {
      url: FLARE_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
      chainId: 0,
    },
  },
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  etherscan: {
    apiKey: {
      mainnet: ETHEREUM_EXPLORER_API_KEY,
      polygon: POLYGON_EXPLORER_API_KEY,
      bsc: BSC_EXPLORER_API_KEY,
      bscTestnet: BSC_EXPLORER_API_KEY,
      avalanche: AVALANCHE_EXPLORER_API_KEY,
      avalancheFujiTestnet: AVALANCHE_EXPLORER_API_KEY,
      arbitrumOne: ARBITRUM_EXPLORER_API_KEY,
      arbitrumTestnet: ARBITRUM_EXPLORER_API_KEY,
      aurora: AURORA_EXPLORER_API_KEY,
      opera: FANTOM_EXPLORER_API_KEY,
      celo: CELO_EXPLORER_API_KEY,
      gnosis2: GNOSIS_EXPLORER_API_KEY,
      xdai: GNOSIS_EXPLORER_API_KEY,
      optimisticEthereum: OPTIMISM_EXPLORER_API_KEY,
      polygonZkEVM: POLYGON_ZKEVM_EXPLORER_API_KEY,
      base: BASE_EXPLORER_API_KEY,
      scroll: SCROLL_EXPLORER_API_KEY,
      moonbeam: MOONBEAM_EXPLORER_API_KEY,
      manta: MANTA_EXPLORER_API_KEY,
      mantaTestnet: MANTA_EXPLORER_API_KEY,
      zetachain: ZETACHAIN_EXPLORER_API_KEY,
      zetachainTestnet: ZETACHAIN_EXPLORER_API_KEY,
      viction: VICTION_EXPLORER_API_KEY,
      victionTestnet: VICTION_EXPLORER_API_KEY,
      linea: LINEA_EXPLORER_API_KEY,
      lineaTestnet: LINEA_EXPLORER_API_KEY,
      blast: BLAST_EXPLORER_API_KEY,
      blastTestnet: BLAST_EXPLORER_API_KEY,
      sei: SEI_EXPLORER_API_KEY,
      seiTestnet: SEI_EXPLORER_API_KEY,
      mode: MODE_EXPLORER_API_KEY,
      modeTestnet: MODE_EXPLORER_API_KEY,
      inevm: INEVM_EXPLORER_API_KEY,
      inevmTestnet: INEVM_EXPLORER_API_KEY,
      fraxtal: FRAX_EXPLORER_API_KEY,
      fraxtalTestnet: FRAX_EXPLORER_API_KEY,
      redstone: REDSTONE_EXPLORER_API_KEY,
      redstoneTestnet: REDSTONE_EXPLORER_API_KEY,
      taiko: TAIKO_EXPLORER_API_KEY,
      taikoTestnet: TAIKO_EXPLORER_API_KEY,
      ancient8: ANCIENT8_EXPLORER_API_KEY,
      ancient8Testnet: ANCIENT8_EXPLORER_API_KEY,
      zora: ZORA_EXPLORER_API_KEY,
      zoraTestnet: ZORA_EXPLORER_API_KEY,
      fuse: FUSE_EXPLORER_API_KEY,
      fuseTestnet: FUSE_EXPLORER_API_KEY,
      mantle: MANTLE_EXPLORER_API_KEY,
      mantleTestnet: MANTLE_EXPLORER_API_KEY,
      bob: BOB_EXPLORER_API_KEY,
      bobTestnet: BOB_EXPLORER_API_KEY,
      xlayer: XLAYER_EXPLORER_API_KEY,
      xlayerTestnet: XLAYER_EXPLORER_API_KEY,
      endurance: ENDURANCE_EXPLORER_API_KEY,
      enduranceTestnet: ENDURANCE_EXPLORER_API_KEY,
      forma: FORMA_EXPLORER_API_KEY,
      formaTestnet: FORMA_EXPLORER_API_KEY,
      worldchain: WORLDCHAIN_EXPLORER_API_KEY,
      worldchainTestnet: WORLDCHAIN_EXPLORER_API_KEY,
      zircuit: ZIRCUIT_EXPLORER_API_KEY,
      zircuitTestnet: ZIRCUIT_EXPLORER_API_KEY,
      superposition: SUPERPOSITION_EXPLORER_API_KEY,
      superpositionTestnet: SUPERPOSITION_EXPLORER_API_KEY,
      mint: MINT_EXPLORER_API_KEY,
      mintTestnet: MINT_EXPLORER_API_KEY,
      real: REAL_EXPLORER_API_KEY,
      realTestnet: REAL_EXPLORER_API_KEY,
      bitlayer: BITLAYER_EXPLORER_API_KEY,
      bitlayerTestnet: BITLAYER_EXPLORER_API_KEY,
      merlin: MERLIN_EXPLORER_API_KEY,
      merlinTestnet: MERLIN_EXPLORER_API_KEY,
      flare: FLARE_EXPLORER_API_KEY,
      flareTestnet: FLARE_EXPLORER_API_KEY,
    },
    customChains: [
      {
        network: "arbitrumTestnet",
        chainId: 421614,
        urls: {
          apiURL: "https://api-sepolia.arbiscan.io/api",
          browserURL: "https://sepolia.arbiscan.io/",
        },
      },
      {
        network: "celo",
        chainId: 42220,
        urls: {
            apiURL: "https://api.celoscan.io/api",
            browserURL: "https://celoscan.io/",
        },
      },
      {
        network: "scroll",
        chainId: 534352,
        urls: {
          apiURL: "https://api.scrollscan.com/api",
          browserURL: "https://scrollscan.com"
        }
      },
      {
        network: "manta",
        chainId: 169,
        urls: {
          apiURL: "https://pacific-explorer.manta.network/api/",
          browserURL: "https://pacific-explorer.manta.network/"
        }
      },
      {
        network: "zetachain",
        chainId: 7000,
        urls: {
          apiURL: "https://explorer.zetachain.com/api",
          browserURL: "https://explorer.zetachain.com/"
        }
      },
      {
        network: "viction",
        chainId: 88,
        urls: {
          apiURL: "https://www.vicscan.xyz/api/contract/hardhat/verify",
          browserURL: "https://vicscan.xyz"
        }
      },
      {
        network: "linea",
        chainId: 59144,
        urls: {
          apiURL: "https://api.lineascan.build/api",
          browserURL: "https://lineascan.build/"
        }
      },
      {
        network: "blast",
        chainId: 81457,
        urls: {
          apiURL: "https://api.blastscan.io/api",
          browserURL: "https://blastscan.io/"
        }
      },
      { 
        network: "sei",
        chainId: 1329,
        urls: {
          apiURL: "https://seitrace.com/pacific-1/api",
          browserURL: "https://seitrace.com"
        }
      },
      {
        network: "mode",
        chainId: 34443,
        urls: {
          apiURL: "https://api.routescan.io/v2/network/mainnet/evm/34443/etherscan",
          browserURL: "https://modescan.io"
        }
      },
      {
        network: "inevm",
        chainId: 2525,
        urls: {
          apiURL: "https://explorer.inevm.com/api",
          browserURL: "https://explorer.inevm.com/"
        }
      },
      {
        network: "fraxtal",
        chainId: 252,
        urls: {
          apiURL: "https://api.fraxscan.com/api",
          browserURL: "https://fraxscan.com/"
        }
      },
      {
        network: "redstone",
        chainId: 690,
        urls: {
          apiURL: "https://explorer.redstone.xyz/api",
          browserURL: "https://explorer.redstone.xyz/"
        }
      },
      {
        network: "taiko",
        chainId: 167000,
        urls: {
          apiURL: "https://api.taikoscan.io/api",
          browserURL: "https://taikoscan.io/"
        }
      },
      {
        network: "ancient8",
        chainId: 888888888,
        urls: {
          apiURL: "https://scan.ancient8.gg/api",
          browserURL: "https://scan.ancient8.gg/"
        }
      },
      {
        network: "zora",
        chainId: 7777777,
        urls: {
          apiURL: "https://explorer.zora.energy/api",
          browserURL: "https://explorer.zora.energy/"
        }
      },
      {
        network: "fuse",
        chainId: 122,
        urls: {
          apiURL: "https://explorer.fuse.io/api",
          browserURL: "https://explorer.fuse.io/"
        }
      },
      {
        network: "mantle",
        chainId: 5000,
        urls: {
          apiURL: "https://explorer.mantle.xyz/api",
          browserURL: "https://explorer.mantle.xyz/"
        }
      },
      {
        network: "bob",
        chainId: 60808,
        urls: {
          apiURL: "https://explorer.gobob.xyz/api",
          browserURL: "https://explorer.gobob.xyz/"
        }
      },
      {
        network: "xlayer",
        chainId: 196,
        urls: {
          apiURL: "https://www.oklink.com/api/v5/explorer/contract/verify-source-code-plugin/XLAYER",
          browserURL: "https://www.oklink.com/xlayer"
        }
      },
      {
        network: "endurance",
        chainId: 648,
        urls: {
          apiURL: "https://explorer-endurance.fusionist.io/api",
          browserURL: "https://explorer-endurance.fusionist.io/"
        }
      },
      {
        network: "forma",
        chainId: 984122,
        urls: {
          apiURL: "https://explorer.forma.art/api",
          browserURL: "https://explorer.forma.art/"
        }
      },
      {
        network: "worldchain",
        chainId: 480,
        urls: {
          apiURL: "https://worldchain-mainnet-explorer.alchemy.com/api",
          browserURL: "https://worldchain-mainnet-explorer.alchemy.com/"
        }
      },
      {
        network: "zircuit",
        chainId: 48900,
        urls: {
          apiURL: "https://explorer.zircuit.com/api/contractVerifyHardhat",
          browserURL: "https://explorer.zircuit.com"
        }
      },
      {
        network: "superposition",
        chainId: 0,
        urls: {
          apiURL: "https://explorer.superposition.io/api/contractVerifyHardhat",
          browserURL: "https://explorer.superposition.io"
        }
      },
      {
        network: "mint",
        chainId: 185,
        urls: {
          apiURL: "https://explorer.mintchain.io/api",
          browserURL: "https://explorer.mintchain.io/"
        }
      },
      {
        network: "real",
        chainId: 111188,
        urls: {
          apiURL: "https://explorer.re.al/api",
          browserURL: "https://explorer.re.al/"
        }
      },
      {
        network: "bitlayer",
        chainId: 200901,
        urls: {
          apiURL: "https://api.btrscan.com/scan/api",
          browserURL: "https://www.btrscan.com/"
        }
      },
      {
        network: "merlin",
        chainId: 4200,
        urls: {
          apiURL: "https://scan.merlinchain.io/api",
          browserURL: "https://scan.merlinchain.io/"
        },
      },
      {
        network: "flare",
        chainId: 14,
        urls: {
          apiURL: "https://api.routescan.io/v2/network/mainnet/evm/14/etherscan",
          browserURL: "https://flare.routescan.io"
        }
      },
    ]
  },
  sourcify: {
    enabled: false
  },
  typechain: {
    target: "ethers-v6",
  },
  abiExporter: {
    path: "./out/abi",
    // runOnCompile: true,
    // clear: true,
    // flat: true,
    // only: [':ERC20$'],
    // spacing: 2,
    // pretty: true,
    // format: "minimal",
  },
};

export default config;
