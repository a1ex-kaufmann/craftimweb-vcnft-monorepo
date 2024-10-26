import BN from "bn.js";

class PedersenHash {
    private readonly PRIME = new BN("21888242871839275222246405745257275088548364400416034343698204186575808495617");
    private readonly BASE_POINTS: [BN, BN][] = [
        // Базовые точки для первого байта (H = 72 = 01001000)
        [new BN("10457101036533406547632367118273992217979173478358440826365724437999023779287"),
         new BN("19824078218392094440610104313265183977899662750282163392862422243483260492317")],
        [new BN("2671756056509184035029146175565761955751135805354291559563293617232983272177"),
         new BN("2663205510731142763556352975002641716101654201788071096152948830924149045094")],
        [new BN("14780632341277755899330141855966417445763615704426434412376262222420362381977"),
         new BN("6586526205469292967029072505733453411091714461133906295743934084920305611402")],
        [new BN("14780632341277755899330141855966417445763615704426434412376262222420362381977"),
         new BN("6586526205469292967029072505733453411091714461133906295743934084920305611402")],
        [new BN("2671756056509184035029146175565761955751135805354291559563293617232983272177"),
         new BN("2663205510731142763556352975002641716101654201788071096152948830924149045094")],
        [new BN("14847277145774472491535108775553949185645479140302075509068557495889939110077"),
         new BN("2326591512750589509921949843619352036718306768768773416742286690051367956130")],
        [new BN("2671756056509184035029146175565761955751135805354291559563293617232983272177"),
         new BN("2663205510731142763556352975002641716101654201788071096152948830924149045094")],
        [new BN("10457101036533406547632367118273992217979173478358440826365724437999023779287"),
         new BN("19824078218392094440610104313265183977899662750282163392862422243483260492317")],

        // Базовые точки для второго байта (e = 101 = 01100101)
        // ... добавьте еще 8 точек

        // Базовые точки для третьего байта (l = 108 = 01101100)
        // ... добавьте еще 8 точек

        // Базовые точки для четвертого байта (l = 108 = 01101100)
        // ... добавьте еще 8 точек

        // Базовые точки для пятого байта (o = 111 = 01101111)
        // ... добавьте еще 8 точек
    ];

    // Сложение точек на кривой
    private addPoints(p1: [BN, BN], p2: [BN, BN]): [BN, BN] {
        if (p1[0].isZero() && p1[1].isZero()) return p2;
        if (p2[0].isZero() && p2[1].isZero()) return p1;

        const lambda = p2[1].sub(p1[1])
            .mul(p2[0].sub(p1[0]).invm(this.PRIME))
            .mod(this.PRIME);

        const x3 = lambda.mul(lambda)
            .sub(p1[0])
            .sub(p2[0])
            .mod(this.PRIME);

        const y3 = lambda.mul(p1[0].sub(x3))
            .sub(p1[1])
            .mod(this.PRIME);

        return [x3, y3];
    }

    // Умножение точки на скаляр
    private scalarMul(point: [BN, BN], scalar: BN): [BN, BN] {
        let result: [BN, BN] = [new BN(0), new BN(0)];
        let temp = point;
        let n = scalar;

        while (!n.isZero()) {
            if (n.and(new BN(1)).eq(new BN(1))) {
                result = this.addPoints(result, temp);
            }
            temp = this.addPoints(temp, temp);
            n = n.shrn(1);
        }

        return result;
    }

    // Преобразование в hex
    private toHex(num: BN): string {
        const hex = num.toString(16).padStart(64, '0');
        return '0x' + hex;
    }

    // Хеширование сообщения
    public hash(message: Uint8Array): string {
        let result: [BN, BN] = [new BN(0), new BN(0)];

        console.log("\nProcessing bits:");
        for (let i = 0; i < message.length; i++) {
            console.log(`\nByte ${i} (${message[i]}): ${message[i].toString(2).padStart(8, '0')}`);
            for (let j = 0; j < 8; j++) {
                const bit = (message[i] >> j) & 1;
                console.log(`Bit ${j}: ${bit}`);
                if (bit === 1) {
                    const basePoint = this.BASE_POINTS[i * 8 + j];
                    if (basePoint) {
                        console.log(`Using base point at index ${i * 8 + j}`);
                        result = this.addPoints(result, basePoint);
                    } else {
                        console.log(`Missing base point at index ${i * 8 + j}`);
                    }
                }
            }
        }

        // Выводим промежуточные значения для отладки
        console.log("\nIntermediate values:");
        console.log("X coordinate:", result[0].toString());
        console.log("Y coordinate:", result[1].toString());

        // Преобразуем результат в hex
        return this.toHex(result[0]);
    }
}

async function main() {
    const pedersen = new PedersenHash();
    
    // Тест с "Hello"
    const message = new TextEncoder().encode("Hello");
    console.log("Input message:", message);
    
    const hash = pedersen.hash(message);
    console.log("\nHash:", hash);
    
    // Ожидаемое значение
    console.log("\nExpected:");
    console.log("0e90d7d613ab8b5ea7f4f8bc537db6bb0fa2e5e97bbac1c1f609ef9e6a35fd8b");
}

main().catch(console.error);
