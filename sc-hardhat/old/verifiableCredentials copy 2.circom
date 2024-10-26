pragma circom 2.1.9;

include "../node_modules/circomlib/circuits/poseidon.circom";
include "../node_modules/circomlib/circuits/mimcsponge.circom";

// Verify Poseidon commitment
template CommitmentVerifier() {
    // Public inputs
    signal input commitment;
    
    // Private inputs
    signal input fieldName;
    signal input value;
    signal input randomness;

    log("=== CommitmentVerifier Inputs ===");
    log("fieldName:", fieldName);
    log("value:", value);
    log("randomness:", randomness);
    log("expected commitment:", commitment);

    // Calculate commitment using Poseidon
    component poseidon = Poseidon(3);
    poseidon.inputs[0] <== fieldName;
    poseidon.inputs[1] <== value;
    poseidon.inputs[2] <== randomness;

    log("calculated commitment:", poseidon.out);

    // Verify commitment matches calculated one
    commitment === poseidon.out;
}

// Verify MiMC hash
template MiMCHasher() {
    signal input left;
    signal input right;
    signal output hash;

    log("\n=== Circom MiMC Hash ===");
    log("Left (decimal):", left);
    log("Right (decimal):", right);

    component mimc = MiMCSponge(2, 220, 1);
    mimc.ins[0] <== left;
    mimc.ins[1] <== right;
    mimc.k <== 0;

    hash <== mimc.outs[0];
    log("Hash result:", hash);
}

// Verify Merkle proof
template MerkleProofVerifier(levels) {
    // Public inputs
    signal input root;
    
    // Private inputs
    signal input leaf;
    signal input pathElements[levels];
    signal input pathIndices[levels];

    log("=== MerkleProofVerifier Inputs ===");
    log("root:", root);
    log("leaf:", leaf);
    
    log("\n=== Merkle Proof Verification Steps ===");
    log("Initial leaf:", leaf);
    
    // Internal signals
    signal computedHash[levels + 1];
    signal leftInput[levels];
    signal rightInput[levels];
    computedHash[0] <== leaf;

    // Compute Merkle path
    component hashers[levels];
    for (var i = 0; i < levels; i++) {
        log("\nStep", i + 1);
        log("Current Hash:", computedHash[i]);
        log("Path Element:", pathElements[i]);
        log("Path Index:", pathIndices[i]);
        
        hashers[i] = MiMCHasher();
        
        // sort pairs
        leftInput[i] <== computedHash[i] + pathIndices[i] * (pathElements[i] - computedHash[i]);
        rightInput[i] <== pathElements[i] + pathIndices[i] * (computedHash[i] - pathElements[i]);
        
        log("Left Input:", leftInput[i]);
        log("Right Input:", rightInput[i]);
        
        hashers[i].left <== leftInput[i];
        hashers[i].right <== rightInput[i];
        
        computedHash[i + 1] <== hashers[i].hash;
        log("Resulting Hash:", computedHash[i + 1]);
    }
    
    log("\nFinal Computed Root:", computedHash[levels]);
    log("Expected Root:", root);

    // Verify computed root matches input root
    root === computedHash[levels];
}

// Main component combining commitment and merkle proof verification
template VerifiableCredentials(levels) {
    // Public inputs
    signal input root;
    signal input commitment;

    // Private inputs
    signal input fieldName;
    signal input value;
    signal input randomness;
    signal input pathElements[levels];
    signal input pathIndices[levels];

    log("=== VerifiableCredentials Main Inputs ===");
    log("root:", root);
    log("commitment:", commitment);
    log("fieldName:", fieldName);
    log("value:", value);
    log("randomness:", randomness);

    // Verify commitment
    component commitmentVerifier = CommitmentVerifier();
    commitmentVerifier.commitment <== commitment;
    commitmentVerifier.fieldName <== fieldName;
    commitmentVerifier.value <== value;
    commitmentVerifier.randomness <== randomness;

    // Verify merkle proof
    component merkleVerifier = MerkleProofVerifier(levels);
    merkleVerifier.root <== root;
    merkleVerifier.leaf <== commitment;
    for (var i = 0; i < levels; i++) {
        merkleVerifier.pathElements[i] <== pathElements[i];
        merkleVerifier.pathIndices[i] <== pathIndices[i];
    }
}

// Set number of levels for the Merkle tree
component main { public [root, commitment] } = VerifiableCredentials(5);
