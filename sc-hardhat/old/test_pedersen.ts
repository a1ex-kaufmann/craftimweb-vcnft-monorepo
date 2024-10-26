import { buildPedersenHash, buildBabyjub } from "circomlibjs";

async function testPedersenHash() {
    // Инициализация
    const pedersen = await buildPedersenHash();
    const babyJub = await buildBabyjub();

    // Создаем входные данные - "Hello"
    const message = new TextEncoder().encode("Hello");
    console.log("\nInput message:", message);
    
    // Конвертируем байты в биты
    function byte2bits(byte: number): number[] {
        const bits = new Array(8).fill(0);
        for (let i = 0; i < 8; i++) {
            bits[i] = (byte >> i) & 1;
        }
        return bits;
    }

    // Преобразуем все сообщение в биты
    const allBits: number[] = [];
    for (const byte of message) {
        allBits.push(...byte2bits(byte));
    }

    console.log("\nMessage as bits:", allBits);

    // Вычисляем хеш
    const hash = pedersen.hash(allBits);

    // Функция для конвертации буфера в hex
    function buff2hex(buff: Uint8Array): string {
        return Array.from(buff)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    console.log("\nHash (hex):", buff2hex(hash));

    // Получаем точку для сравнения с circom
    const point = babyJub.unpackPoint(hash);
    const commitment = BigInt(babyJub.F.toString(point[0]));
    console.log("Hash (decimal):", commitment.toString());

    // Ожидаемое значение из теста
    console.log("\nExpected hex:");
    console.log("0x90d7d613ab8b5ea7f4f8bc537db6bb0fa2e5e97bbac1c1f609ef9e6a35fd8b");
}

testPedersenHash().catch(console.error);
