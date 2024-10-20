"use client";

import React, { useState, useCallback, useRef } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { useAccount, useWalletClient } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";
import dynamic from 'next/dynamic';

// Динамический импорт QrReader, чтобы избежать проблем с SSR
const QrReader = dynamic(() => import('react-qr-reader').then(module => module.QrReader), {
  ssr: false,
});

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { data: nftContract } = useScaffoldContract({
    contractName: "VCNFTCore",
    walletClient,
  }); 
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const qrReaderRef: any = useRef(null);

  const handleScan = useCallback((result: any) => {
    if (result) {
      try {
        const parsedData = JSON.parse(result.text);
        setScannedData(parsedData);
        setScannerOpen(false);
      } catch (error) {
        console.error("Failed to parse QR data:", error);
      }
    }
  }, []);

  const handleError = (error: any) => {
    console.error(error);
  };

  const openScanner = () => {
    setScannerOpen(true);
  };

  const mintNFT = async () => {
    const nonce: any = Math.floor(Math.random() * 100000000).toString();
    const walletAddr: any = connectedAddress;

    await nftContract?.write.mint([
      "0xCF3DAA1CFfEDdb7243d7BF93A4Be95C95E5d5215",
      walletAddr,
      "0x0000000000000000000000000000000000000000000000000000000000000000",
      nonce,
      "0x0000000000000000000000000000000000000000000000000000000000000000"
    ]);
  };

  const closeScanner = () => {
    if (qrReaderRef.current && qrReaderRef.current.stopCamera) {
      qrReaderRef.current.stopCamera();
    }
    setScannerOpen(false);
  };

  return (
    <div className="flex flex-col max-w-7xl justify-center m-6 bg-base-300 p-4 rounded-xl">
      {/* Scan your QR button */}
      <div className="flex justify-center">
        <button 
          className="btn mt-0 my-4 w-2/5 hover:bg-blue-400 hover:text-gray-200"
          onClick={openScanner}
        >
          Scan your QR
        </button>
      </div>
      {/* QR Scanner */}
      {scannerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg" style={{ width: '100vw', maxWidth: '800px' }}>
            <QrReader
              ref={qrReaderRef}
              onResult={handleScan}
              constraints={{ facingMode: 'environment' }}
              containerStyle={{ width: '80%', height: '70vh' }}
              videoContainerStyle={{ width: '100%', height: '100%' }}
              videoStyle={{ objectFit: 'cover' }}
            />
            <button 
              className="btn mt-8 w-full"
              onClick={closeScanner}
            >
              Close Scanner
            </button>
          </div>
        </div>
      )}
      {/* Table */}
      <table className="table-auto w-full bg-base-100">
        <thead>
          <tr className="border-2 border-b-0 border-r-0 border-collapse">
            <th colSpan="2" className="w-1/2 px-6 py-4 border-r-2 text-lg text-center">
              About Organization
            </th>
            <th colSpan="2" className="w-1/2 px-6 py-4 border-r-2 text-lg text-center">
              Certificate Info
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-2 border-b-0 border-r-0 border-collapse">
            <td className="w-2/12 px-2 py-2 text-center border-r-2">Institute Name</td>
            <td className="w-4/12 px-2 py-2 text-center border-r-2">{scannedData?.institutionName || ""}</td>
            <td className="w-2/12 px-2 py-2 text-center border-r-2">First Name</td>
            <td className="w-4/12 px-2 py-2 text-center border-r-2">{scannedData?.firstName || ""}</td>
          </tr>
          <tr className="border-2 border-b-0 border-r-0 border-collapse">
            <td className="w-2/12 px-2 py-2 text-center border-r-2">Course</td>
            <td className="w-4/12 px-2 py-2 text-center border-r-2">{scannedData?.course || ""}</td>
            <td className="w-2/12 px-2 py-2 text-center border-r-2">Last Name</td>
            <td className="w-4/12 px-2 py-2 text-center border-r-2">{scannedData?.lastName || ""}</td>
          </tr>
          <tr className="border-2 border-b-0 border-r-0 border-collapse">
            <td className="w-2/12 px-2 py-2 text-center border-r-2">Degree</td>
            <td className="w-4/12 px-2 py-2 text-center border-r-2">{scannedData?.degree || ""}</td>
            <td className="w-2/12 px-2 py-2 text-center border-r-2">Certificate ID</td>
            <td className="w-4/12 px-2 py-2 text-center border-r-2">{scannedData?.certificateId || ""}</td>
          </tr>
          <tr className="border-2 border-b-0 border-r-0 border-collapse">
            <td className="w-2/12 px-2 py-2 text-center border-r-2 border-b-2">Awarded On</td>
            <td className="w-4/12 px-2 py-2 text-center border-r-2 border-b-2">{scannedData?.awardedOn || ""}</td>
            <td className="w-2/12 px-2 py-2 text-center border-r-2 border-b-2">Status</td>
            <td className="w-4/12 px-2 py-2 text-center border-r-2 border-b-2">
              {scannedData ? "Verified" : "Not Scanned"}
            </td>
          </tr>
        </tbody>
      </table>
      <div className="flex justify-center py-4">
        <button 
          className="btn mt-0 my-4 w-2/5 hover:bg-blue-400 hover:text-gray-200"
          onClick={mintNFT}
          disabled={!scannedData}
        >
          Mint your VC NFT
        </button>
      </div>
    </div>
  );
};

export default Home;