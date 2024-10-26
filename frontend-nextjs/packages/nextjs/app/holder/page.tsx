"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { useAccount, useWalletClient } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";
import dynamic from 'next/dynamic';
import QrScanner from 'qr-scanner';
import { PoseidonCommitment, MiMCMerkleTree, SnarkProver, SnarkProverPath } from "../../utils/zkp_utils";
import { notification } from "~~/utils/scaffold-eth";

// Добавляем импорты для wasm и zkey файлов
const wasmFile = "/circuits/verifiableCredentials.wasm";
const zkeyFile = "/circuits/verifiableCredentials_0000.zkey";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { data: nftContract } = useScaffoldContract({
    contractName: "VCNFTCore",
    walletClient,
  }); 
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannedData, setScannedData] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('scannedData');
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });
  const qrReaderRef: any = useRef(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanner, setScanner] = useState<QrScanner | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [zkpRange, setZkpRange] = useState({
    minValue: "0",
    maxValue: "100"
  });
  const [proofData, setProofData] = useState<{
    proof?: any;
    publicSignals?: any;
    calldata?: string;
  }>({});

  const handleScan = useCallback((result: QrScanner.ScanResult) => {
    console.log("Scan result:", result);
    try {
      const parsedData = JSON.parse(result.data);
      setScannedData(parsedData);
      scanner?.destroy();
      setScannerOpen(false);
    } catch (error) {
      console.error("Failed to parse QR data:", error);
    }
  }, [scanner]);

  // Инициализация сканера
  useEffect(() => {
    let qrScanner: QrScanner | null = null;
    
    if (scannerOpen && videoRef.current) {
      qrScanner = new QrScanner(
        videoRef.current,
        handleScan,
        {
          preferredCamera: 'environment', // Задняя камера
          highlightScanRegion: true,
          highlightCodeOutline: true,
          maxScansPerSecond: 15, // Увеличиваем частоту сканирования
          calculateScanRegion: (video) => {
            // Уменьшаем область сканирования для лучшей точности
            const smallerDimension = Math.min(video.videoWidth, video.videoHeight);
            const scanRegionSize = Math.round(smallerDimension * 0.7);
            
            return {
              x: Math.round((video.videoWidth - scanRegionSize) / 2),
              y: Math.round((video.videoHeight - scanRegionSize) / 2),
              width: scanRegionSize,
              height: scanRegionSize,
            };
          },
          returnDetailedScanResult: true,
          qrEngine: QrScanner.WORKER_PATH,
          onDecodeError: (error: Error) => {
            if (error.message !== 'No QR code found') {
              console.error('Scan error:', error);
              setScanError(error.message);
            }
          },
        }
      );
      
      // станавливаем высокое разрешение камеры
      qrScanner.setInversionMode('original');
      qrScanner.setGrayscaleWeights(0.7, 0.2, 0.1); // Улучшаем контрастность

      setScanner(qrScanner);
      qrScanner.start().catch(err => {
        setScanError('Failed to start camera');
        console.error(err);
      });
    }
    
    return () => {
      qrScanner?.destroy();
      setScanner(null);
    };
  }, [scannerOpen]);

  const handleError = (error: any) => {
    console.error(error);
  };

  const openScanner = () => {
    setScannerOpen(true);
  };

  const mintNFT = async () => {
    const nonce: any = Math.floor(Math.random() * 100000000).toString();
    const walletAddr: any = connectedAddress;

    console.log(scannedData);

    const tokenId = await nftContract?.read.calculateTokenId([scannedData?.root]);
    try {
      await nftContract?.read.mint([
        "0xCF3DAA1CFfEDdb7243d7BF93A4Be95C95E5d5215",
        walletAddr,
        scannedData?.root,
        nonce,
        scannedData?.signature
      ]);
      notification.info("Successfully got token ID " + `Token ID: ${tokenId}`);
    } catch (error: any) {
      if (error.message.includes("ERC1167FailedCreateClone")) {
        notification.error(`Token ID = ${tokenId} already minted`);
        return;
      }
      notification.error(`Failed to get token ID, reason: ${error.message.slice(0, 100)}...`);
      return;
    }


    try {
      await nftContract?.write.mint([
        "0xCF3DAA1CFfEDdb7243d7BF93A4Be95C95E5d5215",
        walletAddr,
        scannedData?.root,
        nonce,
        scannedData?.signature
      ]);
      notification.info("Successfully minted NFT " + `Token ID: ${tokenId}`);
    } catch (error: any) {
      notification.error(`Failed to mint NFT, reason: ${error.message.slice(0, 100)}...`);
    }
  };

  const closeScanner = () => {
    scanner?.destroy();
    setScanner(null);
    setScannerOpen(false);
  };

  const generateProof = async () => {
    try {
      const merkleTree = await MiMCMerkleTree.initialize();
      
      // Добавляем commitment из отсканированных данных
      merkleTree.addLeaf(scannedData?.commitment?.commitment);
      
      // Добавляем ровно 15 пустых листьев для создания дерева высоты 4
      for (let i = 0; i < 31; i++) {
        merkleTree.addLeaf("0x0000000000000000000000000000000000000000000000000000000000000000");
      }

      const root = merkleTree.getRoot();
      const proof = merkleTree.getProof(scannedData?.commitment?.commitment);

      // Проверяем совпадение корней
      if (root !== scannedData?.root) {
        notification.error("Merkle Root Error", "Reconstructed root doesn't match the original root");
        return;
      }

      const proofInput = {
        root: root,
        commitment: scannedData?.commitment?.commitment,
        fieldName: scannedData?.commitment?.leaf?.fieldName,
        value: scannedData?.commitment?.leaf?.value.toString(),
        randomness: scannedData?.commitment?.leaf?.randomness.toString(),
        pathElements: proof.pathElements,
        pathIndices: proof.pathIndices,
        minValue: parseInt(zkpRange.minValue),
        maxValue: parseInt(zkpRange.maxValue)
      };

      console.log("\nProof Input:", proofInput);

      const wasmPath = "/circuits/artifacts/verifiableCredentials_js/verifiableCredentials.wasm";
      const zkeyPath = "/circuits/artifacts/verifiableCredentials_0000.zkey";

      const prover = new SnarkProverPath(wasmPath, zkeyPath);
      try {
        const { proof: zkProof, publicSignals } = await prover.generateProof(proofInput);

        // get calldata
        const calldata = await prover.getCalldata(zkProof, publicSignals);
        console.log("Calldata:", calldata);

        notification.success("Proof generated successfully");

      setProofData({
        proof: zkProof,
          publicSignals,
          });
      } catch (error) {
        if (error.message.includes("VerifiableCredentials_79")) {
          notification.error(`Invalid experience range (VerifiableCredentials_79)`);
          return;
        }
        notification.error(`Failed to generate proof, reason: ${error}`);
      }

    } catch (error) {
      console.error("Error generating proof:", error);
    }
  };

  // Добавляем useEffect для сохранения данных
  useEffect(() => {
    if (scannedData) {
      localStorage.setItem('scannedData', JSON.stringify(scannedData));
    }
  }, [scannedData]);

  return (
    <div className="flex py-6 px-4 flex-row justify-center">
      <div className="flex flex-col bg-base-200 w-full max-w-7xl shadow-xl">
        {/* Scan QR Section */}
        <div className="p-6">
          <h2 className="text-center mb-6 text-2xl font-bold text-base-content">
            Scan Certificate QR Code
          </h2>
          
          <div className="flex justify-center">
            <button 
              className="btn btn-primary w-1/2 rounded-none"
              onClick={openScanner}
            >
              <span className="flex items-center gap-2">
                <MagnifyingGlassIcon className="h-5 w-5" />
                Scan QR Code
              </span>
            </button>
          </div>
        </div>

        {/* Certificate Data Section */}
        <div className="p-6 border-t border-base-300">
          <h2 className="text-center mb-6 text-2xl font-bold text-base-content">
            Certificate Data
          </h2>

          <div className="overflow-x-auto">
            <table className="table w-full bg-base-100">
              <thead>
                <tr>
                  <th className="bg-base-300 rounded-none border-b">Field</th>
                  <th className="bg-base-300 rounded-none border-b">Value</th>
                  <th className="bg-base-300 rounded-none border-b">Field</th>
                  <th className="bg-base-300 rounded-none border-b">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-base-200">
                  <td className="font-medium border-b">Institute Name</td>
                  <td className="border-b">{scannedData?.institutionName || "-"}</td>
                  <td className="font-medium border-b">First Name</td>
                  <td className="border-b">{scannedData?.firstName || "-"}</td>
                </tr>
                <tr className="hover:bg-base-200">
                  <td className="font-medium border-b">Course</td>
                  <td className="border-b">{scannedData?.course || "-"}</td>
                  <td className="font-medium border-b">Last Name</td>
                  <td className="border-b">{scannedData?.lastName || "-"}</td>
                </tr>
                <tr className="hover:bg-base-200">
                  <td className="font-medium border-b">Degree</td>
                  <td className="border-b">{scannedData?.degree || "-"}</td>
                  <td className="font-medium border-b">Certificate ID</td>
                  <td className="border-b">{scannedData?.certificateId || "-"}</td>
                </tr>
                <tr className="hover:bg-base-200">
                  <td className="font-medium border-b">Awarded On</td>
                  <td className="border-b">{scannedData?.awardedOn || "-"}</td>
                  <td className="font-medium border-b">Status</td>
                  <td className="border-b">{scannedData ? "Verified" : "Not Scanned"}</td>
                </tr>
                <tr className="hover:bg-base-200">
                  <td className="font-medium border-b">Experience</td>
                  <td className="border-b">{scannedData?.commitment?.leaf?.value?.toString() || "-"}</td>
                  <td className="font-medium border-b">Commitment</td>
                  <td className="border-b">
                    {scannedData?.commitment?.commitment 
                      ? `${scannedData.commitment.commitment.slice(0, 10)}...${scannedData.commitment.commitment.slice(-10)}` 
                      : "-"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* NFT Minting Section */}
        <div className="p-6 border-t border-base-300">
          <h2 className="text-center mb-6 text-2xl font-bold text-base-content">
            NFT Minting
          </h2>
          
          <div className="flex justify-center">
            <button 
              className={`btn btn-primary w-1/2 rounded-none
                ${!scannedData ? 'btn-disabled opacity-50' : ''}`}
              onClick={mintNFT}
              disabled={!scannedData}
            >
              Mint VC NFT
            </button>
          </div>
        </div>

        {/* ZKP Section */}
        <div className="p-6 border-t border-base-300">
          <h2 className="text-center mb-6 text-2xl font-bold text-base-content">
            Zero Knowledge Proof
          </h2>
          
          <div className="grid grid-cols-2 gap-6 mb-6 bg-base-100 p-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Minimum Experience</span>
              </label>
              <input
                type="number"
                value={zkpRange.minValue}
                onChange={(e) => setZkpRange(prev => ({ ...prev, minValue: e.target.value }))}
                className="input input-bordered w-full rounded-none bg-base-100"
                disabled={!scannedData}
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Maximum Experience</span>
              </label>
              <input
                type="number"
                value={zkpRange.maxValue}
                onChange={(e) => setZkpRange(prev => ({ ...prev, maxValue: e.target.value }))}
                className="input input-bordered w-full rounded-none bg-base-100"
                disabled={!scannedData}
              />
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <button 
              className={`btn btn-primary w-1/2 rounded-none
                ${!scannedData?.commitment?.commitment ? 'btn-disabled opacity-50' : ''}`}
              onClick={generateProof}
              disabled={!scannedData?.commitment?.commitment || 
                parseInt(zkpRange.maxValue) <= parseInt(zkpRange.minValue)}
            >
              Generate ZK Proof
            </button>
          </div>

          <div className="form-control bg-base-100 p-6">
            <label className="label">
              <span className="label-text font-medium">ZK Proof Data</span>
            </label>
            <textarea
              value={proofData.proof ? JSON.stringify(proofData, null, 2) : "Proof not generated yet"}
              readOnly
              className="textarea textarea-bordered h-48 font-mono text-sm rounded-none bg-base-100"
              disabled={!scannedData}
            />
          </div>
        </div>

        {/* QR Scanner Modal */}
        {scannerOpen && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50">
            <div className="bg-base-100 p-6 w-full max-w-3xl">
              <video ref={videoRef} className="w-full h-[60vh] mb-6" />
              <button 
                className="btn btn-error w-full rounded-none"
                onClick={closeScanner}
              >
                Close Scanner
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
