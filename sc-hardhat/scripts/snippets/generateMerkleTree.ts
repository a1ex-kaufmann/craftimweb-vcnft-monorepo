import { ethers } from "hardhat";
import { MerkleTree } from 'merkletreejs';
import { buildPedersenHash, buildMimcSponge, MimcSponge, PedersenHash, buildBabyjub, BabyJub} from 'circomlibjs';
import crypto from 'crypto';
import { sha256 } from "ethers";


interface LeafData {
    fieldName: string;
    data: string;
}

interface NFTData {
    nullifier: bigint,
    secret: bigint,
    commitment: bigint,
    commitmentHex: string,
}

async function pedersenHash(data: Uint8Array): Promise<Uint8Array> {
    const pedersen = await buildPedersenHash();
    
    const babyJub = await buildBabyjub();
    const hash = babyJub.unpackPoint(pedersen.hash(data))[0];
    return hash;

}

let pedersen: PedersenHash;
let mimcSponge: MimcSponge;
// let babyJub: BabyJub;

async function initializeHashFunctions() {
  pedersen = await buildPedersenHash();
  mimcSponge = await buildMimcSponge();
}


// function mimcHashFunction(buffer: Buffer): Buffer {
//   console.log(buffer.length)
//   console.log(buffer.toString('hex'))
//     const hash = mimcSponge.multiHash([buffer.subarray(0, 32), buffer.subarray(32)], 0, 1);
//     return Buffer.from(hash);
// }

function mimcHashFunction(left: Buffer, right: Buffer): Buffer {
  const hash = mimcSponge.multiHash([left, right], 0, 1);
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

function leInt2Buff(value: bigint, len: number): Buffer {
  const result = Buffer.alloc(len);
  let currentByte = 0;
  let bitPosition = 0;

  // Process each bit
  for (let i = 0; i < len * 8; i++) {
      // Extract current bit
      const bit = value & BigInt(1);
      
      // Set bit in current byte
      if (bit === BigInt(1)) {
          currentByte |= (1 << bitPosition);
      }
      
      bitPosition++;
      
      // When we have processed 8 bits, store the byte and reset
      if (bitPosition === 8) {
          result[Math.floor(i / 8)] = currentByte;
          currentByte = 0;
          bitPosition = 0;
      }
      
      value = value >> BigInt(1);
  }
  
  return result;
}

function num2Bits(value: bigint, n: number): Uint8Array {
  const bits: number[] = new Array(n);
  
  for (let i = 0; i < n; i++) {
      bits[i] = Number((value >> BigInt(i)) & BigInt(1));
  }
  
  return new Uint8Array(bits);
}

function uint8ArrayToHex(arr: Uint8Array): string {
  return '0x' + Array.from(arr)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
}

async function generateNFTData(leafData: LeafData): Promise<NFTData> {
  const nullifier = BigInt(leafData.fieldName);
  const secret = BigInt(leafData.data);

  const nullifierBuffer = num2Bits(nullifier, 248);
  const secretBuffer = num2Bits(secret, 248);
  console.log(nullifierBuffer);
  console.log(secretBuffer);

  const preimage = new Uint8Array([...nullifierBuffer, ...secretBuffer]);


    console.log(nullifierBuffer.toString());
    console.log(secretBuffer.toString());
    console.log(preimage.toString());
    const commitment = await pedersenHash(preimage);
    return {
        nullifier: nullifier,
        secret: secret,
        commitment: commitment,
        commitmentHex: uint8ArrayToHex(commitment),
    }
  }
async function main() {

    await initializeHashFunctions();

    const hashedLeaves = [];
    // for (const leaf of jsonData) {
        const nftDataLeaf = await generateNFTData(jsonData[0]);
        // hashedLeaves.push('0x' + nftDataLeaf.commitment.toString('hex'));
        console.log(nftDataLeaf);

        // const hexStringLeaf = {
        //     // nullifier: '0x' + nftDataLeaf.nullifier.toString('hex'),
        //     nullifier: nftDataLeaf.nullifier,
        //     // secret: '0x' + nftDataLeaf.secret.toString('hex'),
        //     secret: nftDataLeaf.secret,
        //     commitment: '0x' + nftDataLeaf.commitment.toString('hex'),
        // }
        // console.log("Hashed leaves:", hexStringLeaf);
    // }

    // console.log(hashedLeaves);
    // const hashedLeavesBuffer = [];
    // for (const leaf of hashedLeaves) {
    //     hashedLeavesBuffer.push(Buffer.from(leaf.slice(2), 'hex'));
    // }

    // const merkleTree = new MerkleTree(hashedLeavesBuffer,
    //   (left: Buffer | string, right: Buffer | string) => {
    //     // Handle the case when right is undefined (for odd number of leaves)
    //     const rightValue = right || left;
        
    //     // Convert inputs to Buffer if they're strings
    //     const leftBuf = Buffer.isBuffer(left) 
    //         ? left 
    //         : Buffer.from(left.toString().replace('0x', ''), 'hex');
    //     const rightBuf = Buffer.isBuffer(rightValue) 
    //         ? rightValue 
    //         : Buffer.from(rightValue.toString().replace('0x', ''), 'hex');
        
    //     return '0x' + mimcHashFunction(leftBuf, rightBuf).toString('hex');
    // }, {
    //     hashLeaves: false,
    //     sortPairs: false
    // });

    // const root = merkleTree.getHexRoot();
    // console.log("Root hash:", root);
    
    // const leaves = merkleTree.getHexLeaves()
    // console.log("Leaves:", leaves);

    // const proof = merkleTree.getPositionalHexProof(leaves[0]);
    // // const proof = merkleTree.getProofIndices(merkleTree.);
    // console.log("Proof for contract: (elems[0])", proof);


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
