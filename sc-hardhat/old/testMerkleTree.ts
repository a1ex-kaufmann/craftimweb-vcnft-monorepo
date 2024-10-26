import { VerifiableCredentialTree } from './merkleTree';

async function main() {
    // Тестовые данные
    const fields = [
        { name: "age", value: "25" },
        { name: "name", value: "John" },
        { name: "occupation", value: "Developer" }
    ];

    // Создаем дерево
    const vcTree = new VerifiableCredentialTree(fields);

    // Получаем корень дерева
    const root = await vcTree.getRoot();
    console.log("Merkle Root:", root);

    // Получаем доказательство для поля age
    const proof = await vcTree.getProof(fields[0]);
    console.log("Proof for age field:", proof);

    // Проверяем доказательство
    const isValid = await vcTree.verify(fields[0], proof);
    console.log("Proof verification:", isValid);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
