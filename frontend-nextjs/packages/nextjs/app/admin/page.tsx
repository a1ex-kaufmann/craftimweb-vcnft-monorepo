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
    <div className="flex flex-col justify-around bg-base-300 rounded-2xl">

      <div className="m-2 mt-4 flex justify-center">
        <input type="search" className="w-2/3" />

      </div>

      <div className="flex justify-center">

        <table className="table-auto">
          <thead>
            <tr>
              <th>
                ID
              </th>
              <th>
                Issuer Name
              </th>
              <th>
                Issuer Wallet Address
              </th>
              <th>
                State
              </th>
            </tr>
          </thead>

          <tbody>
            <td>1</td>
            <td>VTB</td>
            <td>guiyhapsifndogji9823onlfg</td>
            <td>OK</td>
          </tbody>

        </table>
      </div>

      <div className="p-4 flex flex-row justify-center border-2">
        <div className="w-2/3 flex flex-col flex-center justify-center border-2 border-red-500">
          <form className="flex flex-col flex-center justify-center">
            <label className="p-2 pl-4">
              Issuer Name
            </label>
            <input placeholder="Issuer Name"
              className="input rounded-lg h-10" />
          </form>

          <form className="mt-0 flex flex-col flex-center justify-center">
            <label className="p-2 pl-4">
              Issuer Wallet Address
            </label>
            <input placeholder="Address"
              className="input rounded-lg h-10" />
          </form>

          <div className="mt-4 flex justify-center">
            <button 
              type="submit"
              className="btn w-full text-base hover:bg-blue-400 hover:text-gray-200 h-10">
                Add Issuer
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Admin;
