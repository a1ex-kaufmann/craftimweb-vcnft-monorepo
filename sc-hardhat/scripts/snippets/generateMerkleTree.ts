import { ethers } from "hardhat";
import { MerkleTree } from 'merkletreejs';
import { bigInt } from 'snarkjs';
import { buildPedersenHash, buildMimcSponge, MimcSponge, PedersenHash, buildBabyjub, BabyJub} from 'circomlibjs';
import crypto from 'crypto';
import { sha256 } from "ethers";


interface LeafData {
    fieldName: string;
    data: string;
}

interface NFTData {
    nullifier: Buffer,
    secret: Buffer,
    commitment: Buffer,
    nullifierHash: Buffer
}

async function pedersenHash(data: Uint8Array): Promise<Uint8Array> {
    const pedersen = await buildPedersenHash();

    const babyJub = await buildBabyjub();
    return babyJub.unpackPoint(pedersen.hash(data))[0];
}

let pedersen: PedersenHash;
let mimcSponge: MimcSponge;
// let babyJub: BabyJub;

async function initializeHashFunctions() {
  pedersen = await buildPedersenHash();
  mimcSponge = await buildMimcSponge();
}


function mimcHashFunction(buffer: Buffer): Buffer {
    const hash = mimcSponge.multiHash([buffer.subarray(0, 32), buffer.subarray(32)], 0, 1);
    return Buffer.from(hash);
}

// const bigint = (data) => bigInt.leBuff2int(Buffer.from(data, 'hex'));

// function mimcHash(left: string, right: string): string {
//     const mimc7 = mimcsponge.multiHash([left, right], 0, 1);
//     return mimc7.toString();
// }

// async function hashLeaf(leaf: LeafData): Promise<Uint8Array> {
//     // const concatenated = `${leaf.leafId}${leaf.fieldName}${leaf.data}`;
//     // const coder = new ethers.AbiCoder()
//     const concatenated = Buffer.concat([
//         Buffer.from(leaf.fieldName.slice(2), 'hex'),
//         Buffer.from(leaf.data.slice(2), 'hex'),
//     ]);
//     // console.log(concatenated.toString('hex'));
//     const hash = await pedersenHash(concatenated);
//     return hash;
// }

const jsonData: LeafData[] = [
  {
    "fieldName": "0x00000000000000000000000000000000000000000000000000000000000001",
    "data": "0x00000000000000000000000000000000000000000000000000000000000001",
  },
  {
    "fieldName": "0x00000000000000000000000000000000000000000000000000000000000002",
    "data": "0x00000000000000000000000000000000000000000000000000000000000002",
  },
  {
    "fieldName": "0x00000000000000000000000000000000000000000000000000000000000003",
    "data": "0x00000000000000000000000000000000000000000000000000000000000003",
  },
  {
    "fieldName": "0x00000000000000000000000000000000000000000000000000000000000004",
    "data": "0x00000000000000000000000000000000000000000000000000000000000004",
  },
]

async function generateNFTData(leafData: LeafData): Promise<NFTData> {
    const nullifier = Buffer.from(leafData.fieldName.slice(2), 'hex');
    const secret = Buffer.from(leafData.data.slice(2), 'hex');

    // console.log(nullifier.toString('hex'));
    // console.log(secret.toString('hex'));

    const preimage = Buffer.concat([nullifier, secret]);
    const nullifierHash = Buffer.from(await pedersenHash(nullifier.subarray(0, 31)));
    const commitment = Buffer.from(await pedersenHash(preimage)).subarray(0, 31);
    return {
        nullifier: nullifier,
        secret: secret,
        commitment: commitment,
        nullifierHash: nullifierHash
    }
  }

async function main() {

    await initializeHashFunctions();

    const hashedLeaves = [];
    for (const leaf of jsonData) {
        const nftDataLeaf = await generateNFTData(leaf);
        hashedLeaves.push('0x' + nftDataLeaf.commitment.toString('hex'));

        const hexStringLeaf = {
            nullifier: '0x' + nftDataLeaf.nullifier.toString('hex'),
            secret: '0x' + nftDataLeaf.secret.toString('hex'),
            commitment: '0x' + nftDataLeaf.commitment.toString('hex'),
            nullifierHash: '0x' + nftDataLeaf.nullifierHash.toString('hex')
        }
        console.log("Hashed leaves:", hexStringLeaf);
    }

    // console.log(pedersen);
    console.log(hashedLeaves);

    const merkleTree = new MerkleTree(hashedLeaves, mimcHashFunction, {
        hashLeaves: false,
        sortPairs: true
    });

    const root = merkleTree.getHexRoot();
    console.log("Root hash:", root);
    
    const leaves = merkleTree.getHexLeaves()
    console.log("Leaves:", leaves);

    const leaf = hashedLeaves[0];
    const proof = merkleTree.getPositionalHexProof(leaf);
    // const proof = merkleTree.getProofIndices(merkleTree.);
    console.log("Proof for contract: (elems[0])", proof);


//   // hash any elems
//   const nodes = jsonData;
//   let elems = [];
//   nodes.forEach(element => {
//     let hash = ethers.utils.solidityKeccak256(["uint256", "address", "uint256"],[element.releaseId, element.target, element.leafId]);
//     elems.push(hash);
//   });

//   const merkleTree = new MerkleTree(elems, keccak256, { hashLeaves: false, sortPairs: true });

//   const root = merkleTree.getHexRoot();

//   console.log("Root hash:", root);

//   const leaf = elems[0];

//   const proof = merkleTree.getHexProof(leaf);

//   console.log("Proof for contract: (elems[0])", proof);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });