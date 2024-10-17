import { task } from "hardhat/config";

import { VCNFTCore } from "../../typechain-types/contracts/VCNFTCore";

task("task:mint-vc-nft", "Mints VCNFTCore token")
  .addParam("issuer")
  .addParam("target")
  .addParam("merkleRoot")
  .addParam("nonce")
  .addParam("tokenContract")
  .addFlag("sendTransaction")
  .setAction(async (taskArgs, hre) => {
    const issuer = taskArgs.issuer || "0x0000000000000000000000000000000000000000";
    const target = taskArgs.target || "0x0000000000000000000000000000000000000000";
    const merkleRoot = taskArgs.merkleRoot;
    const nonce = taskArgs.nonce;
    const sendTransaction = taskArgs.sendTransaction;
    const tokenContract = taskArgs.tokenContract || "0x0000000000000000000000000000000000000000";

    const VCNFTCoreFactory = await hre.ethers.getContractFactory("VCNFTCore");
    const VCNFTCore = (await VCNFTCoreFactory.attach(tokenContract)) as VCNFTCore;

    const name = await VCNFTCore.name();
    const signer = (await hre.ethers.getSigners())[0];
    const chainId = (await signer.provider?.getNetwork())?.chainId;

    const domain = {
      name: name,
      version: "1",
      chainId: chainId,
      verifyingContract: VCNFTCore.target,
    };

    const types = {
      Mint: [
        { name: "issuer", type: "address" },
        { name: "target", type: "address" },
        { name: "merkleRoot", type: "bytes32" },
        { name: "nonce", type: "uint256" },
      ],
    };

    const value = {
      issuer: issuer,
      target: target,
      merkleRoot: merkleRoot,
      nonce: nonce,
    };


    const signature = await signer.signTypedData(domain, types, value);

    console.log("Prepared data:", value, "\n");
    console.log("Signature:", signature, "\n");

    if (sendTransaction) {
      const tx = await VCNFTCore.connect(signer).mint(
        value.issuer,
        value.target,
        value.merkleRoot,
        value.nonce,
        signature,
        // { value: value.fee }
      );

      console.log("tx:", tx, "\n");
    }
  });
