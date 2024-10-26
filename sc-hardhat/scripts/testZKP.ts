import { PoseidonCommitment, MiMCMerkleTree, CommitmentData, Leaf } from "./zkp_utils";
import { SnarkProver, SnarkVerifier } from "./zkp_utils";  
import * as fs from 'fs';

async function main() {
    // Initialize managers
    const commitmentManager = await PoseidonCommitment.initialize();
    const merkleTree = await MiMCMerkleTree.initialize();

    // Define leaves с прямым hex значением
    const leaf1: Leaf = {
        fieldName: "0x616765",  // "age" в hex
        value: BigInt(25),
        randomness: BigInt("123456789"),
    };

    const leaf2: Leaf = {
        fieldName: "0x616765",  // "age" в hex
        value: BigInt(30),
        randomness: BigInt("987654321"),
    };

    const leaf3: Leaf = {
        fieldName: "0x616765",  // "age" в hex
        value: BigInt(35),
        randomness: BigInt("111111111"),
    };  

    const leaf4: Leaf = {
        fieldName: "0x616765",  // "age" в hex
        value: BigInt(40),
        randomness: BigInt("111111111"),
    };

    // Create commitments
    const commitment1: CommitmentData = {
        leaf: leaf1,
        commitment: commitmentManager.createCommitment(
            leaf1.fieldName,
            leaf1.value,
            leaf1.randomness
        )
    };

    const commitment2: CommitmentData = {
        leaf: leaf2,
        commitment: commitmentManager.createCommitment(
            leaf2.fieldName,
            leaf2.value,
            leaf2.randomness
        )
    };

    const commitment3: CommitmentData = {
        leaf: leaf3,
        commitment: commitmentManager.createCommitment(
            leaf3.fieldName,
            leaf3.value,
            leaf3.randomness
        )
    };

    const commitment4: CommitmentData = {
        leaf: leaf4,
        commitment: commitmentManager.createCommitment(
            leaf4.fieldName,
            leaf4.value,
            leaf4.randomness
        )
    };

    // Log input data
    console.log("\nLeaf 1 Input Data:");
    console.log("Field Name:", commitment1.leaf.fieldName);
    console.log("Randomness:", commitment1.leaf.randomness.toString());
    console.log("Value:", commitment1.leaf.value.toString());

    console.log("\nLeaf 2 Input Data:");
    console.log("Field Name:", commitment2.leaf.fieldName);
    console.log("Randomness:", commitment2.leaf.randomness.toString());
    console.log("Value:", commitment2.leaf.value.toString());
    
    console.log("\nLeaf 3 Input Data:");
    console.log("Field Name:", commitment3.leaf.fieldName);
    console.log("Randomness:", commitment3.leaf.randomness.toString());
    console.log("Value:", commitment3.leaf.value.toString());

    console.log("\nLeaf 4 Input Data:");
    console.log("Field Name:", commitment4.leaf.fieldName);
    console.log("Randomness:", commitment4.leaf.randomness.toString());
    console.log("Value:", commitment4.leaf.value.toString());   

    console.log("\nGenerated Commitments:");
    console.log("Commitment 1:", commitment1.commitment);
    console.log("Commitment 2:", commitment2.commitment);
    console.log("Commitment 3:", commitment3.commitment);
    console.log("Commitment 4:", commitment4.commitment);

    // Add commitments to Merkle Tree
    merkleTree.addLeaf(commitment1.commitment);
    merkleTree.addLeaf(commitment2.commitment);
    merkleTree.addLeaf(commitment3.commitment);
    merkleTree.addLeaf(commitment4.commitment);
    // add 28 leaves
    for (let i = 0; i < 15; i++) {
        merkleTree.addLeaf("0x000000000000000000000000000000000000000000000000000000000000000");
    }

    // Get Merkle Root
    const root = merkleTree.getRoot();
    console.log("\nMerkle Root:", root);

    // // Get and verify proof for commitment1
    const checkingCommitment = commitment3;
    const proof = merkleTree.getProof(checkingCommitment.commitment);
    console.log("\n=== Merkle Proof Generation ===");
    console.log("Commitment:", checkingCommitment);
    console.log("Path Elements:", proof.pathElements);
    console.log("Path Indices:", proof.pathIndices);

    const wasm = fs.readFileSync("circuits/artifacts/verifiableCredentials_js/verifiableCredentials.wasm");
    const zkey = fs.readFileSync("circuits/artifacts/verifiableCredentials_0000.zkey");   

    // Create the proof
    const proofData = {
        root: root,
        commitment: checkingCommitment.commitment,
        fieldName: checkingCommitment.leaf.fieldName,
        value: checkingCommitment.leaf.value.toString(),
        randomness: checkingCommitment.leaf.randomness.toString(),
        pathElements: proof.pathElements,
        pathIndices: proof.pathIndices,
        minValue: 35,
        maxValue: 100
    }
    const prover = new SnarkProver(
        wasm,
        zkey
    );
    const { zkProof, publicSignals } = await prover.generateProof(proofData);
    console.log("\nProof:", zkProof);
    console.log("\nPublic Signals:", publicSignals);
    const calldata = await prover.generateContractCalldata(zkProof, publicSignals);
    console.log("\nContract Calldata:", calldata);

    const verificationKey = JSON.parse(fs.readFileSync("circuits/artifacts/verificationKey.json", "utf8"));   
    console.log(verificationKey)
    const verifier = new SnarkVerifier(
        verificationKey
    );


    const isValid = await verifier.verifyProof(zkProof, publicSignals);
    console.log("\nIs Proof Valid?", isValid); 
    
    process.exit(0);


}

main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
