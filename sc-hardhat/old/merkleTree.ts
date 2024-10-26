import { buildPoseidon } from "circomlibjs";
import { MerkleTree } from "merkletreejs";
import { utils } from "ethers";

interface Field {
    name: string;
    value: string;
}

export class VerifiableCredentialTree {
    private tree: MerkleTree;
    private poseidon: any;
    
    constructor(fields: Field[]) {
        this.initializePoseidon();
        this.buildTree(fields);
    }
    
    private async initializePoseidon() {
        this.poseidon = await buildPoseidon();
    }
    
    private hashField(field: Field): Buffer {
        // Concatenate field name and value
        const concatenated = utils.concat([
            utils.toUtf8Bytes(field.name),
            utils.toUtf8Bytes(field.value)
        ]);
        
        // Hash using Pedersen (via poseidon in this implementation)
        return Buffer.from(this.poseidon.hash(concatenated));
    }
    
    private buildTree(fields: Field[]) {
        const leaves = fields.map(field => this.hashField(field));
        this.tree = new MerkleTree(leaves, this.poseidon.hash, {
            sortPairs: true
        });
    }
    
    public getRoot(): string {
        return this.tree.getHexRoot();
    }
    
    public getProof(field: Field): {
        pathElements: string[];
        pathIndices: number[];
    } {
        const leaf = this.hashField(field);
        const proof = this.tree.getProof(leaf);
        
        return {
            pathElements: proof.map(p => p.data.toString('hex')),
            pathIndices: proof.map(p => p.position === 'right' ? 1 : 0)
        };
    }
    
    public verify(field: Field, proof: ReturnType<typeof this.getProof>): boolean {
        const leaf = this.hashField(field);
        return this.tree.verify(
            proof,
            leaf,
            this.getRoot()
        );
    }
}
