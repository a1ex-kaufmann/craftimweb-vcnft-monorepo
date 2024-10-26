pragma circom 2.1.9;

include "../node_modules/circomlib/circuits/poseidon.circom";

template PoseidonTest() {
    // Публичные входы
    signal input nullifier;
    signal input secret;
    
    // Выход
    signal output hash;

    // Вычисляем Poseidon хеш
    component poseidon = Poseidon(2);
    poseidon.inputs[0] <== nullifier;
    poseidon.inputs[1] <== secret;
    
    // Выводим результат
    hash <== poseidon.out;

    // Логи для отладки
    log("=== Poseidon Test ===");
    log("Inputs:");
    log("Nullifier:", nullifier);
    log("Secret:", secret);
    log("Output hash:", hash);
}

component main { public [nullifier, secret] } = PoseidonTest();
