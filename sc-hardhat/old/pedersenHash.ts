import { buildPedersenHash, buildBabyjub } from 'circomlibjs';

async function main() {
    const pedersen = await buildPedersenHash();
    const babyJub = await buildBabyjub();

    // Входные значения
    const nullifier = BigInt(1);
    const secret = BigInt(1);

    console.log("\nВходные значения:");
    console.log("Nullifier:", nullifier.toString());
    console.log("Secret:", secret.toString());

    // Преобразуем числа в биты точно как в circom
    // Из логов видно, что только первый бит = 1, остальные = 0
    function numberToBits(num: bigint): number[] {
        const bits = new Array(248).fill(0);
        for (let i = 0; i < 248; i++) {
            // В circom мы видим, что биты идут от младшего к старшему
            // Bit 0: 1, Bit 1: 0, Bit 2: 0, ...
            bits[i] = Number((num >> BigInt(i)) & BigInt(1));
        }
        return bits;
    }

    const nullifierBits = numberToBits(nullifier);
    const secretBits = numberToBits(secret);

    // Объединяем биты как в circom
    // Из логов: "Pedersen input 1 at position 0" и "Pedersen input 1 at position 248"
    const allBits = [...nullifierBits, ...secretBits];

    // Хешируем
    const hash = pedersen.hash(allBits);
    
    // Получаем точку и берем X координату как в circom
    const point = babyJub.unpackPoint(hash);
    const commitment = BigInt(babyJub.F.toString(point[0]));

    console.log("\nРезультат:");
    console.log("Полученный:", commitment.toString());
    console.log("Ожидаемый из circom: 20507009857438517540388999660734197799146923375911870232112876661808266217563");
    console.log("Совпадает:", commitment.toString() === "20507009857438517540388999660734197799146923375911870232112876661808266217563");
}

main().catch(console.error);
