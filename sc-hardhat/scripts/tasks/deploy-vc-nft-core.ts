import { task } from "hardhat/config";

import { Contract } from "ethers";
import { VCNFTCore } from "../../typechain-types/contracts/VCNFTCore";

task("task:deploy-vc-nft-core", "Deploys VCNFTCore smart contract")
  .addOptionalParam("name")
  .addOptionalParam("symbol")
  .addOptionalParam("initialOwner")
  .addOptionalParam("simpleAccountImplementation")
  .addOptionalParam("proxyAddress")
  .setAction(async (taskArgs, hre) => {
    const name = taskArgs.name;
    const symbol = taskArgs.symbol;
    const initialOwner = taskArgs.initialOwner || "0x0000000000000000000000000000000000000000";
    const simpleAccountImplementation = taskArgs.simpleAccountImplementation || "0x0000000000000000000000000000000000000000";
    const proxyAddress = taskArgs.proxyAddress || "0x0000000000000000000000000000000000000000";

    const VCNFTCoreFactory = await hre.ethers.getContractFactory("VCNFTCore");
    let vcNFTCore: Contract;
    if (proxyAddress == "0x0000000000000000000000000000000000000000") {
      vcNFTCore = (await hre.upgrades.deployProxy(VCNFTCoreFactory, [name, symbol, initialOwner, simpleAccountImplementation, false])) as VCNFTCore;
      await vcNFTCore.waitForDeployment();
      console.log("VCNFTCore deployed to:", vcNFTCore.target);
    } else if (proxyAddress == "0x0000000000000000000000000000000000000001") {
      const impl = await hre.upgrades.deployImplementation(VCNFTCoreFactory);
      console.log("VCNFTCore implementation", impl);
    } else {
      vcNFTCore = await hre.upgrades.upgradeProxy(proxyAddress, VCNFTCoreFactory);
      console.log("VCNFTCore upgraded", proxyAddress);
    }
  });
