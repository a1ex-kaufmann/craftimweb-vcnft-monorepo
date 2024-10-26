import { buildPedersenHash } from "circomlibjs";
import { BigNumber } from "ethers";

async function calculatePedersenCommitment(nullifier: BigNumber, secret: BigNumber): Promise<BigNumber> {
    // Convert numbers to bits
    const nullifierBits = toBits(nullifier, 248);
    const secretBits = toBits(secret, 248);
    
    // Concatenate bits
    const allBits = [...nullifierBits, ...secretBits];
    
    // Calculate Pedersen hash
    const pedersen = await buildPedersenHash();
    const hash = pedersen.hash(allBits);
    
    // Convert hash point to field element
    const commitment = pedersen.F.toObject(hash[0]);
    
    return BigNumber.from(commitment.toString());
}

function toBits(number: BigNumber, bits: number): number[] {
    const result: number[] = [];
    const binary = number.toBigInt().toString(2).padStart(bits, '0');
    
    for (let i = 0; i < bits; i++) {
        result.push(binary[i] === '1' ? 1 : 0);
    }
    
    return result;
}

async function main() {
    try {
        // Example values
        const nullifier = BigNumber.from("123456789012345678901234567890");
        const secret = BigNumber.from("987654321098765432109876543210");
        
        const commitment = await calculatePedersenCommitment(nullifier, secret);
        console.log("Nullifier:", nullifier.toString());
        console.log("Secret:", secret.toString());
        console.log("Commitment:", commitment.toString());
        
    } catch (error) {
        console.error("Error:", error);
    }
}

main();