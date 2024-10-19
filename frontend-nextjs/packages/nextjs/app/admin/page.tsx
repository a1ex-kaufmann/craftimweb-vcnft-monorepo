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
    <div className="flex flex-col justify-around bg-base-300 rounded-3xl">

      <div className="m-2 mt-4 flex justify-center">
        <input type="search" placeholder="Find Issuer" className="input h-10 w-96 rounded-lg" />
      </div>

      <div className="flex justify-center overflow-auto px-16 max-h-64 border-b-2">

        <table className="table-auto w-full">
          <thead>
            <tr className="border-2 border-b-0 text-center">
              <th className="px-4 py-2 border-r-2 w-6">
                ID
              </th>
              <th className="px-4 py-2 border-r-2">
                Issuer Name
              </th>
              <th className="px-4 py-2 border-r-2">
                Issuer Wallet Address
              </th>
              <th className="px-4 py-2 border-r-2 w-6">
                State
              </th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-2 border-b-0 text-center">
              <td className="px-4 py-2">1</td>
              <td className="px-4 py-2">VTB</td>
              <td className="px-4 py-2">guiyhapsifndogji9823onlfg</td>
              <td className="px-4 py-2">
                <input type="checkbox" className="h-4 w-4" />
              </td>
            </tr>
            <tr className="border-2 border-b-0 text-center">
              <td className="px-4 py-2">2</td>
              <td className="px-4 py-2">Java Education</td>
              <td className="px-4 py-2">guiyhapsifndogji9823onlfg</td>
              <td className="px-4 py-2">
                <input type="checkbox" className="h-4 w-4" />
              </td>
            </tr>
            <tr className="border-2 border-b-0 text-center">
              <td className="px-4 py-2">3</td>
              <td className="px-4 py-2">MIT</td>
              <td className="px-4 py-2">guiyhapsifndogji9823onlfg</td>
              <td className="px-4 py-2">
                <input type="checkbox" className="h-4 w-4" />
              </td>
            </tr>
            <tr className="border-2 border-b-0 text-center">
              <td className="px-4 py-2">4</td>
              <td className="px-4 py-2">MIPT</td>
              <td className="px-4 py-2">guiyhapsifndogji9823onlfg</td>
              <td className="px-4 py-2">
                <input type="checkbox" className="h-4 w-4" />
              </td>
            </tr>
            <tr className="border-2 border-b-0 text-center">
              <td className="px-4 py-2">5</td>
              <td className="px-4 py-2">Coursera</td>
              <td className="px-4 py-2">guiyhapsifndogji9823onlfg</td>
              <td className="px-4 py-2">
                <input type="checkbox" className="h-4 w-4" />
              </td>
            </tr>
            <tr className="border-2 border-b-0 text-center">
              <td className="px-4 py-2">6</td>
              <td className="px-4 py-2">AWS</td>
              <td className="px-4 py-2">guiyhapsifndogji9823onlfg</td>
              <td className="px-4 py-2">
                <input type="checkbox" className="h-4 w-4" />
              </td>
            </tr>
          </tbody>

        </table>
      </div>

      <div className="p-4 pt-0 flex flex-row justify-center w-full">
        <div className="w-96 flex flex-col justify-center">
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
