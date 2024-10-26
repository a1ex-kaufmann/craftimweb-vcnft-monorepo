import { buildPoseidon, buildMimcSponge } from "circomlibjs";
import { MerkleTree } from "merkletreejs";
import * as snarkjs from "snarkjs";

export class MiMCMerkleTree {
    private mimc: any;
    private merkleTree: MerkleTree | null = null;
    private leaves: string[] = [];

    private constructor(mimc: any) {
        this.mimc = mimc;
    }

    // Factory method
    static async initialize(): Promise<MiMCMerkleTree> {
        const mimc = await buildMimcSponge();
        return new MiMCMerkleTree(mimc);
    }

    // MiMC hash function for Merkle Tree
    private mimcHash(input: Buffer, right?: Buffer): Buffer {
        try {
            // Если right не указан, значит оба значения в input
            if (!right) {
                // Разделяем input на две части по 32 байта
                const inputHex = input.toString('hex');
                if (inputHex.length > 64) {
                    const leftHex = inputHex.slice(0, 64);
                    const rightHex = inputHex.slice(64);
                    
                    const leftBigInt = BigInt('0x' + leftHex);
                    const rightBigInt = BigInt('0x' + rightHex);
                    
                    console.log("\n=== TypeScript MiMC Hash (Combined Input) ===");
                    console.log("Left:", leftBigInt.toString());
                    console.log("Right:", rightBigInt.toString());

                    const hash = this.mimc.multiHash([leftBigInt, rightBigInt]);
                    const hashStr = this.mimc.F.toString(hash);
                    
                    console.log("Hash result:", hashStr);
                    return Buffer.from(BigInt(hashStr).toString(16).padStart(64, '0'), 'hex');
                }
                return input;
            }

            // Если right указан, используем оба значения напрямую
            const leftBigInt = BigInt('0x' + input.toString('hex'));
            const rightBigInt = BigInt('0x' + right.toString('hex'));
            
            console.log("\n=== TypeScript MiMC Hash (Separate Inputs) ===");
            console.log("Left:", leftBigInt.toString());
            console.log("Right:", rightBigInt.toString());

            const hash = this.mimc.multiHash([leftBigInt, rightBigInt]);
            const hashStr = this.mimc.F.toString(hash);
            
            console.log("Hash result:", hashStr);
            return Buffer.from(BigInt(hashStr).toString(16).padStart(64, '0'), 'hex');
        } catch (error) {
            console.error('MiMC Hash Error:', error);
            throw error;
        }
    }

    // Add leaf to the tree
    addLeaf(commitment: string): void {
        this.leaves.push(commitment);
        this.merkleTree = null; // Reset tree as it needs to be rebuilt
    }

    // Get or build Merkle Tree
    public getMerkleTree(): MerkleTree {
        if (!this.merkleTree) {
            console.log("\nBuilding Merkle Tree:");
            console.log("Number of leaves:", this.leaves.length);
            
            const leaves = this.leaves.map(c => {
                const hex = BigInt(c).toString(16).padStart(64, '0');
                console.log("Processing leaf:", c, "->", hex);
                return Buffer.from(hex, 'hex');
            });
            
            this.merkleTree = new MerkleTree(leaves, this.mimcHash.bind(this), {
                sortLeaves: false,
                sortPairs: false,
                hashLeaves: false,
                duplicateOdd: false
            });
        }
        return this.merkleTree;
    }

    // Get Merkle Root
    getRoot(): string {
        const tree = this.getMerkleTree();
        const root = tree.getRoot();
        return '0x' + root.toString('hex');
    }

    // Generate Merkle Proof
    getProof(commitment: string): { pathElements: string[], pathIndices: number[] } {
        const tree = this.getMerkleTree();
        const leaf = Buffer.from(BigInt(commitment).toString(16).padStart(64, '0'), 'hex');
        const proof = tree.getProof(leaf);

        console.log("Leaves:", tree.getLeaves().map(l => '0x' + l.toString('hex')) );
        
        return {
            pathElements: proof.map(p => BigInt('0x' + p.data.toString('hex')).toString()),
            pathIndices: proof.map(p => p.position === 'right' ? 1 : 0)
        };
    }

    // Verify Merkle Proof
    verifyProof(commitment: string, proof: { pathElements: string[], pathIndices: number[] }): boolean {
        const tree = this.getMerkleTree();
        const leaf = Buffer.from(BigInt(commitment).toString(16).padStart(64, '0'), 'hex');
        
        const merkleProof = proof.pathElements.map((element, index) => ({
            position: proof.pathIndices[index] === 1 ? 'right' : 'left',
            data: Buffer.from(BigInt(element).toString(16).padStart(64, '0'), 'hex')
        }));
        
        return tree.verify(merkleProof, leaf, tree.getRoot());
    }
}

export class PoseidonCommitment {
    private poseidon: any;

    private constructor(poseidon: any) {
        this.poseidon = poseidon;
    }

    // Factory method
    static async initialize(): Promise<PoseidonCommitment> {
        const poseidon = await buildPoseidon();
        return new PoseidonCommitment(poseidon);
    }

    // Create a commitment
    createCommitment(fieldNameHex: string, value: bigint, randomness: bigint): string {
        const fieldNameBigInt = BigInt(fieldNameHex); // Прямая конвертация из hex
        const commitment = this.poseidon([fieldNameBigInt, value, randomness]);
        return this.poseidon.F.toString(commitment);
    }

    // Convert to hex
    commitmentToHex(commitment: string): string {
        return '0x' + BigInt(commitment).toString(16);
    }
}

export interface Leaf {
    fieldName: string;
    value: bigint;
    randomness: bigint;
}

export interface CommitmentData {
    leaf: Leaf;
    commitment: string;
}

export type WasmData = ArrayBuffer | WebAssembly.Module;
export type ZkeyData = ArrayBuffer | Uint8Array;
export type VerificationKeyData = object;

// Класс для генерации доказательств
export class SnarkProver {
    constructor(
        private readonly wasm: ArrayBuffer,
        private readonly zkey: ArrayBuffer
    ) {}

    public async generateProof(input: any) {
        try {
            const { proof, publicSignals } = await snarkjs.groth16.fullProve(
                input,
                this.wasm,
                this.zkey
            );

            return { proof, publicSignals };
        } catch (error) {
            console.error("Detailed error in generateProof:", error);
            throw error;
        }
    }
}

export class SnarkVerifier {
    constructor(
        private readonly verificationKey: VerificationKeyData
    ) {
        // Добавляем обязательные поля в verification key
        this.verificationKey = verificationKey;
    }

    public async verifyProof(
        proof: any,
        publicSignals: any
    ): Promise<boolean> {
        console.log("\nVerifying SNARK proof...");
        return await snarkjs.groth16.verify(this.verificationKey, publicSignals, proof);
    }
}

// Для работы с путями к файлам
export class SnarkProverPath {
    constructor(
        private readonly wasmPath: string,
        private readonly zkeyPath: string
    ) {}

    public async getCalldata(proof: any, publicSignals: any) {
        return await snarkjs.groth16.exportSolidityCallData(proof, publicSignals);
    }

    public async generateProof(input: any) {
        try {
            console.log("Starting proof generation with input:", input);
            
            const { proof, publicSignals } = await snarkjs.groth16.fullProve(
                input,
                this.wasmPath,
                this.zkeyPath
            );

            return { proof, publicSignals };
        } catch (error) {
            console.error("Detailed error in generateProof:", error);
            throw error;
        }
    }
}

