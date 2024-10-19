#!/bin/bash

snarkjs powersoftau new bn128 12 pot12_0000.ptau -v
snarkjs powersoftau contribute pot12_0000.ptau pot12_0001.ptau --name="First contribution" -v -e="some random text"
snarkjs powersoftau contribute pot12_0001.ptau pot12_0002.ptau --name="Second contribution" -v -e="some random text"
snarkjs powersoftau prepare phase2 pot12_0001.ptau pot12_final.ptau -v

snarkjs groth16 setup purchaseSum.r1cs pot12_final.ptau purchaseSum_0000.zkey
snarkjs zkey contribute purchaseSum_0000.zkey purchaseSum_0001.zkey --name="1st Contributor Name" -v -e="some random text"
snarkjs zkey export verificationkey purchaseSum_0001.zkey verification_key.json
