import { buildPedersenHash, buildBabyjub } from 'circomlibjs';
async function testPedersenHash() {
    const pedersen = await buildPedersenHash();
    const babyJub = await buildBabyjub();

    // Тест 1: Все биты нули
    const test1 = new Array(496).fill(0);
    const hash1 = pedersen.hash(test1);
    console.log("\nTest 1 (all zeros):");
    console.log(BigInt(babyJub.F.toString(babyJub.unpackPoint(hash1)[0])));

    // Тест 2: Только первый бит
    const test2 = new Array(496).fill(0);
    test2[0] = 1;
    const hash2 = pedersen.hash(test2);
    console.log("\nTest 2 (first bit):");
    console.log(BigInt(babyJub.F.toString(babyJub.unpackPoint(hash2)[0])));

    // Тест 3: Только последний бит
    const test3 = new Array(496).fill(0);
    test3[495] = 1;
    const hash3 = pedersen.hash(test3);
    console.log("\nTest 3 (last bit):");
    console.log(BigInt(babyJub.F.toString(babyJub.unpackPoint(hash3)[0])));

    // Тест 4: Биты в разных сегментах
    const test4 = new Array(496).fill(0);
    test4[0] = 1;
    test4[200] = 1;
    const hash4 = pedersen.hash(test4);
    console.log("\nTest 4 (bits in different segments):");
    console.log(BigInt(babyJub.F.toString(babyJub.unpackPoint(hash4)[0])));

    // Тест 5: Наш случай (nullifier=1, secret=1)
    const test5 = new Array(496).fill(0);
    test5[0] = 1;      // nullifier = 1
    test5[248] = 1;    // secret = 1
    const hash5 = pedersen.hash(test5);
    console.log("\nTest 5 (nullifier=1, secret=1, original order):");
    console.log(BigInt(babyJub.F.toString(babyJub.unpackPoint(hash5)[0])));

    // Тест 6: Альтернативный порядок
    const test6 = new Array(496).fill(0);
    test6[247] = 1;    // nullifier = 1
    test6[495] = 1;    // secret = 1
    const hash6 = pedersen.hash(test6);
    console.log("\nTest 6 (nullifier=1, secret=1, reverse order):");
    console.log(BigInt(babyJub.F.toString(babyJub.unpackPoint(hash6)[0])));

    // Тест 7: Оба бита в начале
    const test7 = new Array(496).fill(0);
    test7[0] = 1;
    test7[1] = 1;
    const hash7 = pedersen.hash(test7);
    console.log("\nTest 7 (both bits at start):");
    console.log(BigInt(babyJub.F.toString(babyJub.unpackPoint(hash7)[0])));

    // Тест 8: Биты в первом сегменте (0-199)
    const test8 = new Array(496).fill(0);
    test8[0] = 1;
    test8[100] = 1;
    const hash8 = pedersen.hash(test8);
    console.log("\nTest 8 (both bits in first segment):");
    console.log(BigInt(babyJub.F.toString(babyJub.unpackPoint(hash8)[0])));

    // Тест 9: Биты в разных сегментах (0-199, 200-399)
    const test9 = new Array(496).fill(0);
    test9[199] = 1;
    test9[200] = 1;
    const hash9 = pedersen.hash(test9);
    console.log("\nTest 9 (bits at segment boundary):");
    console.log(BigInt(babyJub.F.toString(babyJub.unpackPoint(hash9)[0])));

    // Тест 10: Биты в начале каждого сегмента
    const test10 = new Array(496).fill(0);
    test10[0] = 1;
    test10[200] = 1;
    const hash10 = pedersen.hash(test10);
    console.log("\nTest 10 (start of each segment):");
    console.log(BigInt(babyJub.F.toString(babyJub.unpackPoint(hash10)[0])));

    // Тест 11: Проверяем порядок битов в Num2Bits
    const test11 = new Array(496).fill(0);
    for (let i = 0; i < 8; i++) {  // Устанавливаем первые 8 бит числа 1
        if ((1 >> i) & 1) {
            test11[i] = 1;
        }
    }
    const hash11 = pedersen.hash(test11);
    console.log("\nTest 11 (first byte as 1):");
    console.log(BigInt(babyJub.F.toString(babyJub.unpackPoint(hash11)[0])));

    // Тест 12: Проверяем разные позиции в первом сегменте
    for (let pos = 0; pos < 5; pos++) {
        const test12 = new Array(496).fill(0);
        test12[pos] = 1;
        const hash12 = pedersen.hash(test12);
        console.log(`\nTest 12.${pos} (bit at position ${pos}):`);
        console.log(BigInt(babyJub.F.toString(babyJub.unpackPoint(hash12)[0])));
    }

    // Тест 13: Проверяем комбинации в первых позициях
    const test13 = new Array(496).fill(0);
    test13[0] = 1;
    test13[1] = 1;
    test13[2] = 1;
    const hash13 = pedersen.hash(test13);
    console.log("\nTest 13 (first three bits):");
    console.log(BigInt(babyJub.F.toString(babyJub.unpackPoint(hash13)[0])));

    // Тест 14: Проверяем биты в середине каждого сегмента
    const test14 = new Array(496).fill(0);
    test14[100] = 1;  // середина первого сегмента
    test14[300] = 1;  // середина второго сегмента
    const hash14 = pedersen.hash(test14);
    console.log("\nTest 14 (middle of segments):");
    console.log(BigInt(babyJub.F.toString(babyJub.unpackPoint(hash14)[0])));

    // Тест 15: Проверяем последовательные биты в начале
    for (let i = 0; i < 4; i++) {
        const test15 = new Array(496).fill(0);
        for (let j = 0; j <= i; j++) {
            test15[j] = 1;
        }
        const hash15 = pedersen.hash(test15);
        console.log(`\nTest 15.${i} (first ${i+1} bits):`);
        console.log(BigInt(babyJub.F.toString(babyJub.unpackPoint(hash15)[0])));
    }

    // Тест 16: Проверяем комбинации в первых двух сегментах
    const test16 = new Array(496).fill(0);
    test16[0] = 1;
    test16[199] = 1;
    const hash16 = pedersen.hash(test16);
    console.log("\nTest 16 (first and last bits of first segment):");
    console.log(BigInt(babyJub.F.toString(babyJub.unpackPoint(hash16)[0])));

    // Тест 17: Пробуем разные позиции во втором сегменте
    for (let i = 0; i < 3; i++) {
        const test17 = new Array(496).fill(0);
        test17[0] = 1;  // Первый бит всегда 1
        test17[200 + i] = 1;  // Меняем позицию во втором сегменте
        const hash17 = pedersen.hash(test17);
        console.log(`\nTest 17.${i} (first bit and ${200 + i} bit):`);
        console.log(BigInt(babyJub.F.toString(babyJub.unpackPoint(hash17)[0])));
    }

    // Тест 18: Проверяем значение близкое к ожидаемому
    const test18 = new Array(496).fill(0);
    test18[0] = 1;
    test18[1] = 1;
    test18[200] = 1;  // Добавляем бит во втором сегменте
    const hash18 = pedersen.hash(test18);
    console.log("\nTest 18 (first two bits and start of second segment):");
    console.log(BigInt(babyJub.F.toString(babyJub.unpackPoint(hash18)[0])));

    // Тест 19: Вариации вокруг первых двух битов
    for (let i = 0; i < 3; i++) {
        const test19 = new Array(496).fill(0);
        test19[0] = 1;
        test19[1] = 1;
        if (i > 0) test19[i + 1] = 1;
        const hash19 = pedersen.hash(test19);
        console.log(`\nTest 19.${i} (first two bits + optional bit ${i + 1}):`);
        console.log(BigInt(babyJub.F.toString(babyJub.unpackPoint(hash19)[0])));
    }

    // Тест 20: Проверяем биты рядом с первыми двумя
    for (let i = 0; i < 3; i++) {
        const test20 = new Array(496).fill(0);
        test20[0] = 1;
        test20[1] = 1;
        test20[2 + i] = 1;
        const hash20 = pedersen.hash(test20);
        console.log(`\nTest 20.${i} (first two bits + bit at ${2 + i}):`);
        console.log(BigInt(babyJub.F.toString(babyJub.unpackPoint(hash20)[0])));
    }

    // Тест 21: Комбинации с битами во втором сегменте
    const test21 = new Array(496).fill(0);
    test21[0] = 1;
    test21[1] = 1;
    test21[200] = 1;
    test21[201] = 1;
    const hash21 = pedersen.hash(test21);
    console.log("\nTest 21 (first two bits + first two bits of second segment):");
    console.log(BigInt(babyJub.F.toString(babyJub.unpackPoint(hash21)[0])));

    console.log("\nExpected value:");
    console.log("20507009857438517540388999660734197799146923375911870232112876661808266217563");
}

testPedersenHash().catch(console.error);
