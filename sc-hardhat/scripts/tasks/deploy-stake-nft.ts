import { task } from "hardhat/config";
import { Contract } from "ethers";
import { StakeNFT } from "../../typechain-types/contracts/StakeNFT";

task("task:deploy-stake-nft", "Deploys StakeNFT smart contract")
  .addOptionalParam("owner")
  .addOptionalParam("stakingToken")
  .addOptionalParam("proxyAddress")
  .setAction(async (taskArgs, hre) => {
    const owner = taskArgs.owner || "0x0000000000000000000000000000000000000000";
    const stakingToken = taskArgs.stakingToken || "0x0000000000000000000000000000000000000000";
    const proxyAddress = taskArgs.proxyAddress || "0x0000000000000000000000000000000000000000";

    const StakeNFTFactory = await hre.ethers.getContractFactory("StakeNFT");
    let stakeNFT: Contract;

    if (proxyAddress == "0x0000000000000000000000000000000000000000") {
      stakeNFT = (await hre.upgrades.deployProxy(StakeNFTFactory, [owner, stakingToken])) as StakeNFT;
      await stakeNFT.waitForDeployment();
      console.log("StakeNFT deployed to:", stakeNFT.target);
    } else if (proxyAddress == "0x0000000000000000000000000000000000000001") {
      const impl = await hre.upgrades.deployImplementation(StakeNFTFactory);
      console.log("StakeNFT implementation", impl);
    } else {
      stakeNFT = await hre.upgrades.upgradeProxy(proxyAddress, StakeNFTFactory);
      console.log("StakeNFT upgraded", proxyAddress);
    }
  });
