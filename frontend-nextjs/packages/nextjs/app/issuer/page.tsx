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
import { randomBytes } from "crypto";

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
    certificateId: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    walletAddress: "0x0Bab83B8FCf004ab7181186a9eA216C86AbC4Daf",
    signature: "<----- sign vc please",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

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
      issuer: "0xCF3DAA1CFfEDdb7243d7BF93A4Be95C95E5d5215",
      target: "0xCF3DAA1CFfEDdb7243d7BF93A4Be95C95E5d5215",
      merkleRoot: "0x0000000000000000000000000000000000000000000000000000000000000000",
      nonce: 1,
    };

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

  const formatCertificateData = () => {
    const verifiableCredential = {
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://www.w3.org/2018/credentials/examples/v1"
      ],
      "id": `urn:uuid:${formData.certificateId}`,
      "type": ["VerifiableCredential", "EducationCredential"],
      "issuer": {
        "id": "did:example:123456789abcdefghi",
        "name": formData.institutionName
      },
      "issuanceDate": new Date().toISOString(),
      "credentialSubject": {
        "id": `did:ethr:${formData.walletAddress}`,
        "type": "Student",
        "givenName": formData.firstName,
        "familyName": formData.lastName,
        "degree": {
          "type": "BachelorDegree",
          "name": formData.degree,
          "course": formData.course
        }
      },
      "expirationDate": new Date(new Date().setFullYear(new Date().getFullYear() + 5)).toISOString()
    };

    return JSON.stringify(verifiableCredential, null, 2);
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
      "id": `urn:uuid:${formData.certificateId}`,
      "type": ["VerifiableCredential", "EducationCredential"],
      "issuer": {
        "id": "did:example:123456789abcdefghi",
        "name": formData.institutionName
      },
      "issuanceDate": new Date().toISOString(),
      "credentialSubject": {
        "id": `did:ethr:${formData.walletAddress}`,
        "type": "Student",
        "givenName": formData.firstName,
        "familyName": formData.lastName,
        "degree": {
          "type": "BachelorDegree",
          "name": formData.degree,
          "course": formData.course
        }
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

    // Generate QR code
    const qrCodeData = JSON.stringify(formData);
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

  return (
    <>
          <div className="flex py-4 flex-row justify-center">
      <div className="flex flex-row justify-around bg-base-300 rounded-3xl w-full max-w-screen-xl">
        <div className="p-6 py-3 align-center w-full max-w-screen-2xl">
          <h2 className="text-center mb-0 text-xl font-bold">
            Organization Info
          </h2>
          {/* Issuer Name field */}
            <div className="flex flex-col justify-start">
              <label className="mx-2 text-center">
                Issuer Name
              </label>
              <input type="text"
                placeholder=""
                name="institutionName"
                value={formData.institutionName}
                onChange={handleInputChange}
                className="input mx-2 my-1 p-1 rounded-md h-10"
              />
            </div>
            {/* Course field */}
            <div className="flex flex-col justify-start">
              <label className="mx-2 text-center">
                Course
              </label>
              <input type="text"
                placeholder=""
                name="course"
                value={formData.course}
                onChange={handleInputChange}
                className="input mx-2 my-1 p-1 rounded-md h-10"
              />
            </div>
            {/* Degree field */}
            <div className="flex flex-col justify-start">
              <label className="mx-2 text-center">
                Degree
              </label>
              <input type="text"
                placeholder=""
                name="degree"
                value={formData.degree}
                onChange={handleInputChange}
                className="input mx-2 my-1 p-1 rounded-md h-10"
              />
            </div>
            {/* Awarded_On field */}
            <div className="flex flex-col justify-start">
              <label className="mx-2 text-center">
                Awarded On
              </label>
              <input type="date"
                placeholder=""
                name="awardedOn"
                value={formData.awardedOn}
                onChange={handleInputChange}
                className="input mx-2 my-1 p-1 rounded-md h-10"
              />
            </div>
            <div className="flex flex-col justify-center my-2 p-2">
              <button onClick={handleMakeSignature}
                className="btn hover:bg-blue-400 hover:text-gray-100">
                  Make signature
              </button>
            </div>
            <div className="flex flex-col justify-center my-2 p-2">
              <button onClick={handleShowVC}
                className="btn hover:bg-blue-400 hover:text-gray-100">
                  Show VC + VC-QR
              </button>
            </div>
        </div>

        {/* --------------------------------------------------------------- */}

        <div className="p-6 py-3 align-center w-full max-w-screen-2xl">
          <h2 className="text-center mb-0 text-xl font-bold">
            Holder Info
          </h2>
            {/* First Name field */}
            <div className="flex flex-col justify-start">
              <label className="mx-2 text-center">
                First Name
              </label>
              <input type="text"
                placeholder=""
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="input mx-2 my-1 p-1 rounded-md h-10"
              />
            </div>
            {/* Last Name field */}
            <div className="flex flex-col justify-start">
              <label className="mx-2 text-center">
                Last Name
              </label>
              <input type="text"
                placeholder=""
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="input mx-2 my-1 p-1 rounded-md h-10"
              />
            </div>
            {/* Cert ID field */}
            <div className="flex flex-col justify-start">
              <label className="mx-2 text-center">
                Certification ID
              </label>
              <input type="text"
                placeholder=""
                name="certificateId"
                value={formData.certificateId}
                onChange={handleInputChange}
                className="input mx-2 my-1 p-1 rounded-md h-10"
              />
            </div>
            {/* Holder Wallet field */}
            <div className="flex flex-col justify-start">
              <label className="mx-2 text-center">
                Wallet Address
              </label>
              <input type="text"
                placeholder=""
                name="walletAddress"
                value={formData.walletAddress}
                onChange={handleInputChange}
                className="input mx-2 my-1 p-1 rounded-md h-10"
              />
            </div>
            <div className="flex flex-col justify-start">
              <label className="mx-2 text-center">
                Issuer's signature
              </label>
              <input type="text"
                placeholder=""
                name="signature"
                value={formData.signature}
                readOnly
                onChange={handleInputChange}
                className="input mx-2 my-1 p-1 rounded-md h-10"
              />
            </div>
            <div className="flex flex-col justify-center my-2 p-2">
                <button onClick={handleIssueCertificate}
                  className="btn hover:bg-blue-400 hover:text-gray-100">
                    Issue Certificate
                </button>
              </div>
        </div>
      </div>
    </div>
    {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
            <h3 className="text-lg font-bold mb-4">Verifiable Credential</h3>

            <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96 mb-4">
              <code>{formatCertificateData()}</code>
              <div className="w-1/2 pl-4 flex justify-center items-center">
              <QRCodeImage data={JSON.stringify(createVerifiableCredential())} />
              </div>
            </pre>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
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
