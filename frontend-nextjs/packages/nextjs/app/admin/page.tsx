"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { useState } from "react";

const Admin: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  const [formData, setFormData] = useState({
    institutionName: "",
    course: "",
    degree: "",
    awardedOn: "",
    firstName: "",
    lastName: "",
    certificateId: "",
    walletAddress: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleClear = () => {
    setFormData({
      institutionName: "",
      course: "",
      degree: "",
      awardedOn: "",
      firstName: "",
      lastName: "",
      certificateId: "",
      walletAddress: "",
    });
  };

  const handleIssueCertificate = () => {
    console.log("Issuing certificate with data:", formData);
  };

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to </span>
            
          </h1>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-4 px-8 py-8">
          <div className="flex justify-center items-center gap-0 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-16 py-10 text-center items-center max-w-xs rounded-3xl">
            <h2 className="text-2xl font-semibold mb-4">Organisation Info</h2>
            <input
              type="text"
              placeholder="Institution name"
              name="institutionName"
              value={formData.institutionName}
              onChange={handleInputChange}
              className="input input-bordered w-full mb-4"
            />
            <input
              type="text"
              placeholder="Course"
              name="course"
              value={formData.course}
              onChange={handleInputChange}
              className="input input-bordered w-full mb-4"
            />
            <input
              type="text"
              placeholder="Degree"
              name="degree"
              value={formData.degree}
              onChange={handleInputChange}
              className="input input-bordered w-full mb-4"
            />
            <input
              type="date"
              placeholder="Awarded on"
              name="awardedOn"
              value={formData.awardedOn}
              onChange={handleInputChange}
              className="input input-bordered w-full mb-4"
            />
            <button onClick={handleClear} className="btn btn-secondary w-full">Clear</button>
            </div>
            <div className="flex flex-col bg-base-100 px-16 py-10 text-center items-center max-w-xs rounded-3xl">
            <h2 className="text-2xl font-semibold mb-4">Holder Info</h2>
            <input
              type="text"
              placeholder="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="input input-bordered w-full mb-4"
            />
            <input
              type="text"
              placeholder="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="input input-bordered w-full mb-4"
            />
            <input
              type="text"
              placeholder="Certificate ID"
              name="certificateId"
              value={formData.certificateId}
              onChange={handleInputChange}
              className="input input-bordered w-full mb-4"
            />
            <input
              type="text"
              placeholder="Wallet Address"
              name="walletAddress"
              value={formData.walletAddress}
              onChange={handleInputChange}
              className="input input-bordered w-full mb-4"
            />
            <button onClick={handleIssueCertificate} className="btn btn-primary w-full">Issue Certificate</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;
