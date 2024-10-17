import { ethers } from "hardhat";

const targetAddress = "";

async function main() {
  const balance = await ethers.provider.getBalance(targetAddress);
  console.log(`address ${targetAddress} balance: ${balance}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
