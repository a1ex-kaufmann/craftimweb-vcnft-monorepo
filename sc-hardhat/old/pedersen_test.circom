pragma circom 2.1.9;

include "circomlib/circuits/pedersen.circom";
include "circomlib/circuits/bitify.circom";

template PedersenTest() {
    // Входные данные - ASCII коды для "Hello" (5 байт)
    signal input message[5];  // [72, 101, 108, 108, 111]
    signal output hash;

    // Конвертируем каждый байт в 8 бит
    component bytes2bits[5];
    for (var i = 0; i < 5; i++) {
        bytes2bits[i] = Num2Bits(8);
        bytes2bits[i].in <== message[i];
    }

    // Создаем Pedersen хеш (5 байт * 8 бит = 40 бит)
    component pedersen = Pedersen(40);

    // Заполняем биты
    for (var i = 0; i < 5; i++) {
        for (var j = 0; j < 8; j++) {
            pedersen.in[i*8 + j] <== bytes2bits[i].out[j];
        }
    }

    // Выводим результат
    hash <== pedersen.out[0];

    // Логи для отладки
    log("=== Debug Info ===");
    log("Input message bytes:");
    for (var i = 0; i < 5; i++) {
        log(message[i]);
    }
    log("Output hash:", hash);
}

component main = PedersenTest();
