"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount, useSignTypedData, useWalletClient } from "wagmi";
import { ethers } from 'ethers';
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { useState, useEffect } from "react";
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { saveAs } from 'file-saver';

import { PoseidonCommitment, MiMCMerkleTree, CommitmentData, Leaf } from "../../../../../sc-hardhat/scripts/zkp_utils";

const Admin: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const { data: walletClient } = useWalletClient();

  const [formData, setFormData] = useState({
    institutionName: "Moscow Institute of Physics and Technology",
    course: "09.03.03",
    degree: "Bachelor",
    awardedOn: "2024-10-19",
    firstName: "Ivan",
    lastName: "Ivanov",
    experience: "40",
    certificateId: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    walletAddress: "0x0Bab83B8FCf004ab7181186a9eA216C86AbC4Daf",
    signature: "<----- sign vc please",
    root: "",
    commitment: {}
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zkpRange, setZkpRange] = useState({
    minValue: "0",
    maxValue: "100"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const isSignatureValid = formData.signature.length === 132;

  const handleShowVC = () => {
    setIsModalOpen(true);
    // setFormData({
    //   institutionName: "",
    //   course: "",
    //   degree: "",
    //   awardedOn: "",
    //   firstName: "",
    //   lastName: "",
    //   certificateId: "",
    //   walletAddress: "",
    //   signature: "",
    // });
  };

  const handleMakeSignature = async () => {
    const timestamp = getAwardedOnTimestamp();
    console.log("Award timestamp:", timestamp);

    const commitmentManager = await PoseidonCommitment.initialize();
    const merkleTree = await MiMCMerkleTree.initialize();

    const leaf1: Leaf = {
      fieldName: "0x657870657269656e6365", // experience
      value: BigInt(formData.experience),
      randomness: BigInt("12345"),
    };
    const commitment1: CommitmentData = {
      leaf: leaf1,
      commitment: commitmentManager.createCommitment(leaf1.fieldName, leaf1.value, leaf1.randomness)
    };
    merkleTree.addLeaf(commitment1.commitment);
    // add 31 leaves
    for (let i = 0; i < 31; i++) {
      merkleTree.addLeaf("0x000000000000000000000000000000000000000000000000000000000000000");
    }
    const root = merkleTree.getRoot();
    console.log("\nMerkle Root:", root);

    const domain = {
      name: "demoCert",
      version: "1",
      chainId: 421614,
      verifyingContract: "0xCF3DAA1CFfEDdb7243d7BF93A4Be95C95E5d5215",
    };

    const types = {
      Mint: [
        { name: "issuer", type: "address" },
        { name: "target", type: "address" },
        { name: "merkleRoot", type: "bytes32" },
        { name: "nonce", type: "uint256" },
      ],
    };

    const value = {
      issuer: connectedAddress,
      target: formData.walletAddress,
      merkleRoot: root,
      nonce: ethers.hexlify(ethers.randomBytes(32)),
    };

    console.log(value);

    if (!walletClient) {
      console.error("Wallet client not available");
      return;
    }
    const signature = await walletClient.signTypedData({
      domain,
      types,
      primaryType: 'Mint',
      message: value,
    });

    setFormData(prevState => ({
      ...prevState,
      signature: signature,
      root: root,
      commitment: commitment1,
    }));
    // setIsModalOpen(true);
    // setFormData({
    //   institutionName: "",
    //   course: "",
    //   degree: "",
    //   awardedOn: "",
    //   firstName: "",
    //   lastName: "",
    //   certificateId: "",
    //   walletAddress: "",
    //   signature: "",
    // });
  };

  const getAwardedOnTimestamp = (): number => {
    // Convert date string to timestamp (seconds since epoch)
    const date = new Date(formData.awardedOn);
    return Math.floor(date.getTime() / 1000);
  };

  const handleIssueCertificate = async () => {
    console.log("Issuing certificate with data:", formData);
    await generatePDF();
  };

  const createVerifiableCredential = () => {
    return {
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://www.w3.org/2018/credentials/examples/v1"
      ],
      "id": `https://craftimweb-vcnft.edinorogi.online/certid/:${formData.certificateId}`,
      "type": ["VerifiableCredential", "EducationCredential"],
      "issuer": {
        "id": `did:ethr:0x93A6eF7C6b49E406d7f345A65B5eE5353f3202d9`,
        "name": formData.institutionName
      },
      "issuanceDate": new Date().toISOString(),
      "credentialSubject": {
        "id": `did:ethr:${formData.walletAddress}`,
        "givenName": formData.firstName,
        "familyName": formData.lastName,
        "commitment": formData.commitment,
        "merkleRoot": formData.root,
      },
      "expirationDate": new Date(new Date().setFullYear(new Date().getFullYear() + 5)).toISOString()
    };
  };

  const generatePDF = async () => {
    const pdf = new jsPDF();
    
    // Add certificate information to PDF
    pdf.setFontSize(22);
    pdf.text('Certificate of Completion', 105, 20, { align: 'center' });
    
    pdf.setFontSize(16);
    pdf.text(`This is to certify that`, 105, 40, { align: 'center' });
    pdf.setFontSize(20);
    pdf.text(`${formData.firstName} ${formData.lastName}`, 105, 50, { align: 'center' });
    pdf.setFontSize(16);
    pdf.text(`has successfully completed the course`, 105, 60, { align: 'center' });
    pdf.setFontSize(20);
    pdf.text(`${formData.course}`, 105, 70, { align: 'center' });
    pdf.setFontSize(16);
    pdf.text(`and earned the degree of`, 105, 80, { align: 'center' });
    pdf.setFontSize(20);
    pdf.text(`${formData.degree}`, 105, 90, { align: 'center' });
    pdf.setFontSize(16);
    pdf.text(`awarded on ${formData.awardedOn}`, 105, 100, { align: 'center' });
    pdf.text(`by ${formData.institutionName}`, 105, 110, { align: 'center' });

    // add text with formData in separate block
    let y = 190;
    pdf.setFontSize(8);
    Object.entries(formData).forEach(([key, value]) => {
      if (key == "signature") {
        value = "Signature: " + value.slice(0, 32) + "...";
      }
      if (key !== "commitment") {
        pdf.text(`${key}: ${value}`, 10, y, { align: 'left', maxWidth: 180 });
      }
      y += 4;
    });
    
    // Generate QR code
    const qrCodeData = safeStringifyCompressed(formData);
    const qrCodeDataUrl = await QRCode.toDataURL(qrCodeData);
    pdf.addImage(qrCodeDataUrl, 'PNG', 75, 120, 60, 60);

    // Add metadata to PDF
    pdf.setProperties({
      title: `Certificate for ${formData.firstName} ${formData.lastName}`,
      subject: `${formData.degree} in ${formData.course}`,
      author: formData.institutionName,
      keywords: 'certificate, education',
      creator: 'Certificate Issuing System',
      signature: 'test'
    });

    pdf.addMetadata("test", "test");

    // Save PDF
    const pdfBlob = pdf.output('blob');
    saveAs(pdfBlob, `${formData.firstName}_${formData.lastName}_Certificate.pdf`);
  };

  // Функция для безопасной сериализации JSON с BigInt
  const safeStringify = (obj: any) => {
    const str = JSON.stringify(obj, (key, value) => 
      typeof value === 'bigint' 
        ? value.toString() 
        : value
    , 2);
    return str;
  };

  const safeStringifyCompressed = (obj: any) => 
    JSON.stringify(obj, (key, value) => 
      typeof value === 'bigint' 
        ? value.toString() 
        : value
    );

  const handleGenerateProof = async () => {
    try {
      const merkleTree = await MiMCMerkleTree.initialize();
      const proof = merkleTree.getProof(formData.commitment.commitment);

      const proofInput = {
        root: formData.root,
        commitment: formData.commitment.commitment,
        fieldName: formData.commitment.leaf.fieldName,
        value: formData.commitment.leaf.value.toString(),
        randomness: formData.commitment.leaf.randomness.toString(),
        pathElements: proof.pathElements,
        pathIndices: proof.pathIndices,
        minValue: parseInt(zkpRange.minValue),
        maxValue: parseInt(zkpRange.maxValue)
      };

      // ... rest of the proof generation code ...
    } catch (error) {
      console.error("Error generating proof:", error);
    }
  };

  return (
    <>
      <div className="flex py-6 px-4 flex-row justify-center">
        <div className="flex flex-col md:flex-row justify-around bg-base-200 w-full max-w-7xl shadow-xl">
          {/* Organization Info Column */}
          <div className="p-6 w-full md:w-1/2">
            <h2 className="text-center mb-6 text-2xl font-bold text-base-content">
              Organization Info
            </h2>
            
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Issuer Name</span>
                </label>
                <input 
                  type="text"
                  name="institutionName"
                  value={formData.institutionName}
                  onChange={handleInputChange}
                  className="input input-bordered w-full rounded-none"  // Убрали закругления
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Course</span>
                </label>
                <input 
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  className="input input-bordered w-full rounded-none"  // Убрали закругления
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Degree</span>
                </label>
                <input 
                  type="text"
                  name="degree"
                  value={formData.degree}
                  onChange={handleInputChange}
                  className="input input-bordered w-full rounded-none"  // Убрали закругления
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Awarded On</span>
                </label>
                <input 
                  type="date"
                  name="awardedOn"
                  value={formData.awardedOn}
                  onChange={handleInputChange}
                  className="input input-bordered w-full rounded-none"  // Убрали закругления
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Experience</span>
                </label>
                <input 
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="input input-bordered w-full rounded-none"  // Убрали закругления
                />
              </div>

              <div className="space-y-2 pt-4">
                <button 
                  onClick={handleMakeSignature}
                  className="btn btn-primary w-full rounded-none"  // Убрали закругления
                >
                  Make signature
                </button>
                
                <button 
                  onClick={handleShowVC}
                  disabled={!isSignatureValid}
                  className="btn btn-secondary w-full rounded-none"  // Убрали закругления
                >
                  Show VC + VC-QR
                </button>
              </div>
            </div>
          </div>

          {/* Holder Info Column */}
          <div className="p-6 w-full md:w-1/2 border-t md:border-l md:border-t-0 border-base-300">
            <h2 className="text-center mb-6 text-2xl font-bold text-base-content">
              Holder Info
            </h2>
            
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">First Name</span>
                </label>
                <input 
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="input input-bordered w-full rounded-none"  // Убрали закругления
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Last Name</span>
                </label>
                <input 
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="input input-bordered w-full rounded-none"  // Убрали закругления
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Certification ID</span>
                </label>
                <input 
                  type="text"
                  name="certificateId"
                  value={formData.certificateId}
                  onChange={handleInputChange}
                  className="input input-bordered w-full font-mono text-sm rounded-none"  // Убрали закругления
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Wallet Address</span>
                </label>
                <input 
                  type="text"
                  name="walletAddress"
                  value={formData.walletAddress}
                  onChange={handleInputChange}
                  className="input input-bordered w-full font-mono text-sm rounded-none"  // Убрали закругления
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Issuer's signature</span>
                </label>
                <input 
                  type="text"
                  name="signature"
                  value={formData.signature}
                  readOnly
                  className="input input-bordered w-full font-mono text-sm rounded-none"  // Убрали закругления
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Commitment</span>
                </label>
                <textarea
                  name="commitment"
                  value={safeStringify(formData.commitment)}
                  readOnly
                  className="textarea textarea-bordered h-24 font-mono text-sm rounded-none"  // Убрали закругления
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Merkle Root</span>
                </label>
                <input 
                  type="text"
                  name="root"
                  value={formData.root || "-"}
                  readOnly
                  className="input input-bordered w-full font-mono text-sm rounded-none"  // Убрали закругления
                />
              </div>

              <div className="pt-4">
                <button 
                  onClick={handleIssueCertificate}
                  disabled={!isSignatureValid}
                  className="btn btn-accent w-full rounded-none"  // Убрали закругления
                >
                  Issue Certificate
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50">
          <div className="bg-base-100 w-full max-w-3xl p-6">
            <h3 className="text-xl font-bold mb-4">Verifiable Credential</h3>
            
            <pre className="bg-base-200 p-4 rounded-md overflow-auto max-h-96 mb-4">
              <code>{safeStringify(createVerifiableCredential())}</code>
              <div className="w-1/2 pl-4 flex justify-center items-center">
                <QRCodeImage data={safeStringifyCompressed(createVerifiableCredential())} />
              </div>
            </pre>
            
            <button 
              onClick={() => setIsModalOpen(false)}
              className="btn btn-primary w-full rounded-none"  // Убрали закругления
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const QRCodeImage = ({ data }) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');

  useEffect(() => {
    QRCode.toDataURL(data)
      .then(url => {
        setQrCodeDataUrl(url);
      })
      .catch(err => {
        console.error(err);
      });
  }, [data]);

  return qrCodeDataUrl ? (
    <img src={qrCodeDataUrl} alt="QR Code" className="max-w-full h-auto" />
  ) : (
    <div>Loading QR Code...</div>
  );
};

export default Admin;
