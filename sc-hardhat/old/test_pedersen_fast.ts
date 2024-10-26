import { pedersen_from_hex } from "pedersen-fast";

async function main() {

    // Тестовые значения
    const nullifier = "0x1";
    const secret = "0x1";

    console.log("\nВходные значения:");
    console.log("Nullifier:", nullifier.toString());
    console.log("Secret:", secret.toString());

    // Вычисляем хеш
    const hash = pedersen_from_hex(nullifier, secret);
    
    console.log("\nРезультат:");
    console.log("Полученный:", hash.toString());
    console.log("Ожидаемый: 20507009857438517540388999660734197799146923375911870232112876661808266217563");
    console.log("Совпадает:", hash.toString() === "20507009857438517540388999660734197799146923375911870232112876661808266217563");
}

main().catch(console.error);
