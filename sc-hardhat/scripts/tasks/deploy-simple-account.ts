import { task } from "hardhat/config";

import { Contract } from "ethers";
import { SimpleAccount } from "../../typechain-types/contracts/SimpleAccount";

task("task:deploy-simple-account", "Deploys SimpleAccount smart contract")
  .setAction(async (taskArgs, hre) => {
    const SimpleAccountFactory = await hre.ethers.getContractFactory("SimpleAccount");
    const leaderBoard = await SimpleAccountFactory.deploy();
    await leaderBoard.waitForDeployment();
    console.log("SimpleAccount deployed to:", leaderBoard.target);

  });
