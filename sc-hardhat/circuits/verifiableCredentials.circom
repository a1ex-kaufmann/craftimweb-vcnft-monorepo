pragma circom 2.1.9;

include "../node_modules/circomlib/circuits/poseidon.circom";
include "../node_modules/circomlib/circuits/mimcsponge.circom";
include "../node_modules/circomlib/circuits/comparators.circom";

template CommitmentVerifier() {

    signal input commitment;

    signal input fieldName;
    signal input value;
    signal input randomness;

    log("=== CommitmentVerifier Inputs ===");
    log("fieldName:", fieldName);
    log("value:", value);
    log("randomness:", randomness);
    log("expected commitment:", commitment);

    component poseidon = Poseidon(3);
    poseidon.inputs[0] <== fieldName;
    poseidon.inputs[1] <== value;
    poseidon.inputs[2] <== randomness;

    log("calculated commitment:", poseidon.out);

    commitment === poseidon.out;
}

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

    component hashers[levels];
    for (var i = 0; i < levels; i++) {
        log("\nStep", i + 1);
        log("Current Hash:", computedHash[i]);
        log("Path Element:", pathElements[i]);
        log("Path Index:", pathIndices[i]);
        
        hashers[i] = MiMCHasher();
        
        // sort pairs
        leftInput[i] <== pathElements[i] + pathIndices[i] * (computedHash[i] - pathElements[i]);
        rightInput[i] <== computedHash[i] + pathIndices[i] * (pathElements[i] - computedHash[i]);
        
        log("Left Input:", leftInput[i]);
        log("Right Input:", rightInput[i]);
        
        hashers[i].left <== leftInput[i];
        hashers[i].right <== rightInput[i];
        
        computedHash[i + 1] <== hashers[i].hash;
        log("Resulting Hash:", computedHash[i + 1]);
    }
    
    log("\nFinal Computed Root:", computedHash[levels]);
    log("Expected Root:", root);

    root === computedHash[levels];
}

template VerifiableCredentials(levels) {
    // Public inputs
    signal input root;
    signal input fieldName;
    signal input minValue;
    signal input maxValue;

    // Private inputs
    signal input commitment;
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

    log("=== Check value range ===");
    log("minValue:", minValue);
    log("maxValue:", maxValue);
    
    log("Checking range: ", minValue, " <= ", value, " <= ", maxValue);
    
    component greaterThanEq = GreaterEqThan(252);
    component lessThanEq = LessEqThan(252);
    greaterThanEq.in[0] <== value;
    greaterThanEq.in[1] <== minValue;
    lessThanEq.in[0] <== value;
    lessThanEq.in[1] <== maxValue;
    greaterThanEq.out === 1;
    lessThanEq.out === 1;

    component commitmentVerifier = CommitmentVerifier();
    commitmentVerifier.commitment <== commitment;
    commitmentVerifier.fieldName <== fieldName;
    commitmentVerifier.value <== value;
    commitmentVerifier.randomness <== randomness;

    component merkleVerifier = MerkleProofVerifier(levels);
    merkleVerifier.root <== root;
    merkleVerifier.leaf <== commitment;
    for (var i = 0; i < levels; i++) {
        merkleVerifier.pathElements[i] <== pathElements[i];
        merkleVerifier.pathIndices[i] <== pathIndices[i];
    }
}

component main { public [root, fieldName, minValue, maxValue] } = VerifiableCredentials(5);
