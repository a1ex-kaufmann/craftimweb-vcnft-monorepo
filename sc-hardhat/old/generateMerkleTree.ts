import { buildPedersenHash, buildMimcSponge, buildBabyjub } from 'circomlibjs';
import { MerkleTree } from 'merkletreejs';
import { writeFileSync } from 'fs';
import crypto from 'crypto';

interface NFTData {
    nullifier: Buffer;
    secret: Buffer;
    commitment: Buffer;
    nullifierHash: Buffer;
}

interface CircuitInput {
    root: string;
    nullifierHash: string;
    nullifier: string;
    secret: string;
    pathElements: string[];
    pathIndices: number[];
}

class MerkleTreeGenerator {
    private pedersen: any;
    private mimcSponge: any;
    private babyJub: any;
    private merkleTree: MerkleTree;
    private nftDataList: NFTData[] = [];

    async initialize() {
        this.pedersen = await buildPedersenHash();
        this.mimcSponge = await buildMimcSponge();
        this.babyJub = await buildBabyjub();
    }

    // Generate random buffer of specified size (default 31 bytes)
    private generateRandomBuffer(size: number = 31): Buffer {
        return crypto.randomBytes(size);
    }

    // Sequential MiMC hashing: first hash the left value, then hash the result with right value
    private mimcHash(left: Buffer, right: Buffer): Buffer {
        // First hash with left value
        const firstHash = this.mimcSponge.multiHash([
            BigInt('0x' + left.toString('hex'))
        ], BigInt(0), 1);
        
        // Then hash the result with right value
        const finalHash = this.mimcSponge.multiHash([
            firstHash,
            BigInt('0x' + right.toString('hex'))
        ], BigInt(0), 1);
        
        return Buffer.from(finalHash.toString(16).padStart(64, '0'), 'hex');
    }

    

    // Calculate commitment using Pedersen hash
    private pedersenCommitment(nullifier: Buffer, secret: Buffer): Buffer {
        // Concatenate nullifier and secret, then hash with Pedersen
        const preimage = Buffer.concat([nullifier, secret]);
        const commitment = Buffer.from(
            this.babyJub.unpackPoint(this.pedersen.hash(preimage))[0]
        );
        return commitment;
    }

    // Generate NFT data including nullifier, secret, commitment and nullifierHash
    async generateNFTData(): Promise<NFTData> {
        const nullifier = this.generateRandomBuffer();
        const secret = this.generateRandomBuffer();
        
        // Calculate commitment using Pedersen hash
        const commitment = this.pedersenCommitment(nullifier, secret);
        
        // Calculate nullifierHash using Pedersen hash
        const nullifierHash = Buffer.from(
            this.babyJub.unpackPoint(this.pedersen.hash(nullifier))[0]
        );

        return {
            nullifier,
            secret,
            commitment,
            nullifierHash
        };
    }

    // Generate Merkle tree with specified number of leaves
    async generateTree(numLeaves: number = 4) {
        // Generate NFT data for each leaf
        for (let i = 0; i < numLeaves; i++) {
            const nftData = await this.generateNFTData();
            this.nftDataList.push(nftData);
        }

        // Create array of commitments for Merkle tree
        const commitments = this.nftDataList.map(data => 
            '0x' + data.commitment.toString('hex')
        );

        // Create Merkle tree using sequential MiMC hashing
        this.merkleTree = new MerkleTree(commitments, 
            (left: Buffer | string, right: Buffer | string) => {
                // Handle the case when right is undefined (for odd number of leaves)
                const rightValue = right || left;
                
                // Convert inputs to Buffer if they're strings
                const leftBuf = Buffer.isBuffer(left) 
                    ? left 
                    : Buffer.from(left.toString().replace('0x', ''), 'hex');
                const rightBuf = Buffer.isBuffer(rightValue) 
                    ? rightValue 
                    : Buffer.from(rightValue.toString().replace('0x', ''), 'hex');
                
                return '0x' + this.mimcHash(leftBuf, rightBuf).toString('hex');
            },
            { hashLeaves: false, sortPairs: false }
        );

        console.log('\nMerkle Tree Info:');
        console.log('Root:', this.merkleTree.getHexRoot());
        console.log('Leaves:', this.merkleTree.getHexLeaves());
    }

    // Generate circuit input for specified leaf index
    async generateCircuitInput(leafIndex: number = 0): Promise<CircuitInput> {
        if (!this.nftDataList[leafIndex]) {
            throw new Error('Leaf index out of bounds');
        }

        const nftData = this.nftDataList[leafIndex];
        const leaf = '0x' + nftData.commitment.toString('hex');
        const proof = this.merkleTree.getPositionalHexProof(leaf);

        // Split proof into pathElements and pathIndices
        const pathElements = proof.map(p => p.pathElement);
        const pathIndices = proof.map(p => p.position === 'right' ? 1 : 0);

        const input: CircuitInput = {
            root: this.merkleTree.getHexRoot(),
            nullifierHash: '0x' + nftData.nullifierHash.toString('hex'),
            nullifier: '0x' + nftData.nullifier.toString('hex'),
            secret: '0x' + nftData.secret.toString('hex'),
            pathElements,
            pathIndices
        };

        // Save input data to file
        writeFileSync(
            'circuits/input.json',
            JSON.stringify(input, null, 2)
        );

        // Output debug information
        console.log('\nGenerated NFT Data:');
        console.log('Nullifier:', '0x' + nftData.nullifier.toString('hex'));
        console.log('Secret:', '0x' + nftData.secret.toString('hex'));
        console.log('Commitment (Pedersen):', '0x' + nftData.commitment.toString('hex'));
        console.log('NullifierHash (Pedersen):', '0x' + nftData.nullifierHash.toString('hex'));
        
        console.log('\nMerkle Proof:');
        console.log('Path Elements:', pathElements);
        console.log('Path Indices:', pathIndices);

        // Output intermediate hashes for debugging
        console.log('\nIntermediate MiMC Hashes:');
        for (let i = 0; i < pathElements.length; i++) {
            const element = pathElements[i];
            // Skip iteration if element is undefined
            if (!element) continue;
            
            const index = pathIndices[i];
            const left = index === 0 ? leaf : element;
            const right = index === 1 ? leaf : element;
            const hash = this.mimcHash(
                Buffer.from(left.slice(2), 'hex'),
                Buffer.from(right.slice(2), 'hex')
            );
            console.log(`Level ${i} Hash:`, '0x' + hash.toString('hex'));
        }

        return input;
    }

    // Getter methods
    getTree() {
        return this.merkleTree;
    }

    getNFTDataList() {
        return this.nftDataList;
    }
}

// Main execution function
async function main() {
    const generator = new MerkleTreeGenerator();
    await generator.initialize();
    
    // Generate tree with 4 leaves
    await generator.generateTree(4);
    
    // Generate input for the first leaf
    const circuitInput = await generator.generateCircuitInput(0);
    
    console.log('\nCircuit Input saved to circuits/input.json');
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
