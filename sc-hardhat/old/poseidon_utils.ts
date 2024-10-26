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

    // Create a commitment from secret and value
    createCommitment(fieldName: string, secret: bigint, value: bigint): string {
        // Convert fieldName to bigint using UTF-8 encoding
        const fieldNameBytes = Buffer.from(fieldName, 'utf8');
        const fieldNameBigInt = BigInt('0x' + fieldNameBytes.toString('hex'));
        
        // Create commitment using all three values
        const commitment = this.poseidon([fieldNameBigInt, secret, value]);
        return this.poseidon.F.toString(commitment);
    }

    // Verify if the commitment matches the provided values
    verifyCommitment(commitment: string, fieldName: string, secret: bigint, value: bigint): boolean {
        const calculatedCommitment = this.createCommitment(fieldName, secret, value);
        return commitment === calculatedCommitment;
    }

    // Generate cryptographically secure random value
    generateRandomValue(): bigint {
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
    const fieldName = "age";
    const secret = BigInt(123456);
    const value = BigInt(25); // Example: age value

    console.log("\nInput values:");
    console.log("Field Name:", fieldName);
    console.log("Secret:", secret.toString());
    console.log("Value:", value.toString());

    // Get commitment
    const commitment = commitmentManager.createCommitment(fieldName, secret, value);
    console.log("\nCommitment:");
    console.log("Decimal:", commitment);
    console.log("Hex:", commitmentManager.commitmentToHex(commitment));

    // Verify valid input
    const isValid = commitmentManager.verifyCommitment(commitment, fieldName, secret, value);
    console.log("\nVerification:");
    console.log("Valid commitment:", isValid);

    // Verify with wrong value
    const wrongValue = BigInt(26);
    const isInvalid = commitmentManager.verifyCommitment(commitment, fieldName, secret, wrongValue);
    console.log("Invalid commitment:", isInvalid);
}

main().catch(console.error);
