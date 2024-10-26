"use client";

import { useState, useEffect } from "react";
import type { NextPage } from "next";
import { useAccount, useWalletClient } from "wagmi";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const { data: walletClient } = useWalletClient();
  
  // Инициализация состояний из localStorage
  const [proof, setProof] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('verifier_proof') || "";
    }
    return "";
  });
  
  const [verifyFields, setVerifyFields] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('verifier_fields');
      return saved ? JSON.parse(saved) : {
        tokenId: "",
        tokenOwner: "",
        fieldName: "",
        minValue: "",
        maxValue: ""
      };
    }
    return {
      tokenId: "",
      tokenOwner: "",
      fieldName: "",
      minValue: "",
      maxValue: ""
    };
  });

  // Сохранение в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('verifier_proof', proof);
    localStorage.setItem('verifier_fields', JSON.stringify(verifyFields));
  }, [proof, verifyFields]);

  const { data: nftContract } = useScaffoldContract({
    contractName: "VCNFTCore",
    walletClient,
  });

  const handleVerify = async () => {
    if (!nftContract) return;
    
    try {
      const fieldNameHex = '0x' + Buffer.from(verifyFields.fieldName).toString('hex');
      const proofData = JSON.parse(proof);
      
      // get merkle tree root
      const merkleTreeRoot = await nftContract.read.tokenMerkleRoot([BigInt(verifyFields.tokenId)]);
      const rootFromProof = '0x' + BigInt(proofData.publicSignals[0]).toString(16).padStart(64, '0');
      console.log("root from token:", merkleTreeRoot);
      console.log('rootFromProof:', rootFromProof);
      if (rootFromProof != merkleTreeRoot) {
        notification.error("ERROR! \n \n root from token != root from proof");
        return;
      }

      // check field name
      const fieldNameHexCheck = '0x' + Buffer.from(verifyFields.fieldName).toString('hex');
      const fieldNameFromProofCheck = '0x' + BigInt(proofData.publicSignals[1]).toString(16);
      console.log('fieldNameHex:', fieldNameHexCheck);
      console.log('fieldNameFromProof:', fieldNameFromProofCheck);
      if (fieldNameHexCheck != fieldNameFromProofCheck) {
        notification.error("ERROR! \n \n field name != field name from proof");
        return;
      }

      // Verify ZK proof
      const result = await nftContract.read.verifyProof([
        [
          BigInt(proofData.proof.pi_a[0]),
          BigInt(proofData.proof.pi_a[1])
        ],
        [
          [BigInt(proofData.proof.pi_b[0][1]), BigInt(proofData.proof.pi_b[0][0])],
          [BigInt(proofData.proof.pi_b[1][1]), BigInt(proofData.proof.pi_b[1][0])]
        ],
        [
          BigInt(proofData.proof.pi_c[0]),
          BigInt(proofData.proof.pi_c[1])
        ],
        proofData.publicSignals.map((signal: any) => BigInt(signal))
      ]);

      if (!result) {
        notification.error("ERROR! \n \n ZK proof verification failed");
        return;
      }

      notification.success(
        "SUCCESS! \n \n All verifications passed successfully \n\n zkProof.fieldName == fieldName \n\n zkProof.root == real token root \n\n experience range: [" + proofData.publicSignals[2] + ":" + proofData.publicSignals[3] + "]" 
      );

      // Очистка полей и localStorage после успешной верификации
      // setProof("");
      // setVerifyFields({
      //   tokenId: "",
      //   tokenOwner: "",
      //   fieldName: "",
      //   minValue: "",
      //   maxValue: ""
      // });
      // localStorage.removeItem('verifier_proof');
      // localStorage.removeItem('verifier_fields');
    } catch (error) {
      console.error("Verification error:", error);
    }
  };

  return (
    <div className="flex py-6 px-4 flex-row justify-center">
      <div className="flex flex-col bg-base-200 w-full max-w-7xl shadow-xl">
        <div className="p-6">
          <h2 className="text-center mb-6 text-2xl font-bold text-base-content">
            Token Verification
          </h2>
          
          <div className="bg-base-100 p-6">
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text font-medium">Token ID</span>
              </label>
              <input 
                type="text" 
                className="input input-bordered rounded-none bg-base-100"
                value={verifyFields.tokenId}
                onChange={(e) => setVerifyFields({...verifyFields, tokenId: e.target.value})}
                placeholder="Enter token ID"
              />
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text font-medium">Token Owner</span>
              </label>
              <input 
                type="text" 
                className="input input-bordered rounded-none bg-base-100"
                value={verifyFields.tokenOwner}
                onChange={(e) => setVerifyFields({...verifyFields, tokenOwner: e.target.value})}
                placeholder="0x..."
              />
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text font-medium">Field Name</span>
              </label>
              <input 
                type="text" 
                className="input input-bordered rounded-none bg-base-100"
                value={verifyFields.fieldName}
                onChange={(e) => setVerifyFields({...verifyFields, fieldName: e.target.value})}
                placeholder="Enter field name"
              />
            </div>

            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text font-medium">Proof</span>
              </label>
              <textarea 
                className="textarea textarea-bordered rounded-none bg-base-100"
                value={proof}
                onChange={(e) => setProof(e.target.value)}
                placeholder="Enter proof data"
              />
            </div>

            <div className="flex justify-center">
              <button 
                className="btn btn-primary w-1/2 rounded-none"
                onClick={handleVerify}
                disabled={!proof || !verifyFields.tokenId || !verifyFields.tokenOwner || !nftContract}
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
