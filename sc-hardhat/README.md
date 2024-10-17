# craftimweb-vcnft contracts

NFT smart contract system for verifiable credentials

- Language: Solidity v0.8.20

- Project framework: hardhat (ethers) + typechain

- Nodejs: v18.18

## Installation & Usage

1. Install packages
```
yarn
```

2. Build project
```
yarn build
```

### Run linter

For .sol files
```
yarn lint:sol
```

For .ts files
```
yarn lint:ts
```

### Run prettier

For .sol files
```
yarn prettier:sol
```

For .ts files
```
yarn prettier:ts
```

### Usage

1. Check network in ```hardhat.config.ts``` ([docs](https://hardhat.org/config/))

2. Setup environment variables:
```
cp .env.example .env
```

then edit SIGNER_PRIVATE_KEY (required) and EXPLORER_API_KEY (optional)

3. Deploy SimpleAccount smart contract:
```
yarn hardhat task:deploy-simple-account --network <network name>
```

4. Deploy VCNFTCore smart contract:
```
yarn hardhat:deploy-vc-nft-core --name <token name> --symbol <token symbol> --initial-owner <owner address> --simple-account-implementation <SimpleAccount address> --network <network name>
```

For upgrading:
```
yarn hardhat:deploy-vc-nft-core --proxy-address <proxy-token sc address> --network <network name>
```

5. Mint NFT
```
yarn hardhat task:mint-vc-nft --issuer <issuer address> --target <target address> --merkle-root <merkle root hash> --nonce <nonce number> --token-contract <VCNFTCore address> --network <network name>
```

6. Verify in the explorer (optional)
```
yarn hardhat verify <contract address> --network <network name>
```
