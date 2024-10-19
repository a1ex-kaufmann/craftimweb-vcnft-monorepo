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
    <div className="flex flex-row justify-center">
      <div className="flex flex-row justify-around bg-base-300 rounded-3xl w-full max-w-screen-xl">
        <div className="p-6 py-3 align-center w-full max-w-screen-2xl">
          <h2 className="text-center mb-0 text-xl font-bold">
            Organization Info
          </h2>
          {/* Issuer Name field */}
          <form className="pt-2">
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
                name="Degree"
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
                name="Awarded On"
                value={formData.awardedOn}
                onChange={handleInputChange}
                className="input mx-2 my-1 p-1 rounded-md h-10"
              />
            </div>
            <div className="flex flex-col justify-center my-2 p-2">
              <button onClick={handleClear}
                className="btn hover:bg-blue-400 hover:text-gray-100">
                  Clear
              </button>
            </div>
          </form>
        </div>

        {/* --------------------------------------------------------------- */}

        <div className="p-6 py-3 align-center w-full max-w-screen-2xl">
          <h2 className="text-center mb-0 text-xl font-bold">
            Holder Info
          </h2>
          <form className="pt-2">
            {/* First Name field */}
            <div className="flex flex-col justify-start">
              <label className="mx-2 text-center">
                First Name
              </label>
              <input type="text"
                placeholder=""
                name="holderFirstName"
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
                name="holderLastName"
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
                name="holderCertId"
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
                name="holderWallet"
                value={formData.awardedOn}
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default Admin;
