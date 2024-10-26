import { buildPoseidon } from "circomlibjs";

export class PoseidonCommitment {
    private poseidon: any;

    private constructor(poseidon: any) {
        this.poseidon = poseidon;
    }

    // Factory method to create an instance
    static async initialize(): Promise<PoseidonCommitment> {
        const poseidon = await buildPoseidon();
        return new PoseidonCommitment(poseidon);
    }

    // Create a commitment from secret and randomness
    createCommitment(secret: bigint, randomness: bigint): string {
        const commitment = this.poseidon([secret, randomness]);
        return this.poseidon.F.toString(commitment);
    }

    // Verify if the commitment matches the provided secret and randomness
    verifyCommitment(commitment: string, secret: bigint, randomness: bigint): boolean {
        const calculatedCommitment = this.createCommitment(secret, randomness);
        return commitment === calculatedCommitment;
    }

    // Generate cryptographically secure random value for randomness
    generateRandomness(): bigint {
        const randomBytes = new Uint8Array(31); // 31 bytes for safe BigInt
        crypto.getRandomValues(randomBytes);
        return BigInt('0x' + Buffer.from(randomBytes).toString('hex'));
    }

    // Convert commitment to hex format
    commitmentToHex(commitment: string): string {
        return '0x' + BigInt(commitment).toString(16);
    }
}

// Usage example
async function main() {
    const commitmentManager = await PoseidonCommitment.initialize();

    // Create commitment
    const secret = BigInt(123456);
    const randomness = commitmentManager.generateRandomness();

    console.log("\nInput values:");
    console.log("Secret:", secret.toString());
    console.log("Randomness:", randomness.toString());

    // Get commitment
    const commitment = commitmentManager.createCommitment(secret, randomness);
    console.log("\nCommitment:");
    console.log("Decimal:", commitment);
    console.log("Hex:", commitmentManager.commitmentToHex(commitment));

    // Verify valid input
    const isValid = commitmentManager.verifyCommitment(commitment, secret, randomness);
    console.log("\nVerification:");
    console.log("Valid commitment:", isValid);

    // Verify with wrong secret
    const wrongSecret = BigInt(123457);
    const isInvalid = commitmentManager.verifyCommitment(commitment, wrongSecret, randomness);
    console.log("Invalid commitment:", isInvalid);
}

main().catch(console.error);