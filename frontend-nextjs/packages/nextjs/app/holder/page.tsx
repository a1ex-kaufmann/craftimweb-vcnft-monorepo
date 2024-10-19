"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <div className=" flex flex-col max-w-7xl justify-center m-6 bg-base-300 p-4 rounded-xl">
      {/* Scan your QR button */}
      <div className="flex justify-center">
        <button className="btn mt-0 my-4 w-2/5 hover:bg-blue-400 hover:text-gray-200">
          Scan your QR
        </button>
      </div>
      {/* !Scan your QR button */}
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
            {/* placeholder */}
            <td className="w-4/12 px-2 py-2 text-center border-r-2"></td>
            <td className="w-2/12 px-2 py-2 text-center border-r-2">First Name</td>
            {/* placeholder */}
            <td className="w-4/12 px-2 py-2 text-center border-r-2"></td>
          </tr>

          <tr className="border-2 border-b-0 border-r-0 border-collapse">
            <td className="w-2/12 px-2 py-2 text-center border-r-2">Course</td>
            {/* placeholder */}
            <td className="w-4/12 px-2 py-2 text-center border-r-2"></td>
            <td className="w-2/12 px-2 py-2 text-center border-r-2">Last Name</td>
            {/* placeholder */}
            <td className="w-4/12 px-2 py-2 text-center border-r-2"></td>
          </tr>

          <tr className="border-2 border-b-0 border-r-0 border-collapse">
            <td className="w-2/12 px-2 py-2 text-center border-r-2">Degree</td>
            {/* placeholder */}
            <td className="w-4/12 px-2 py-2 text-center border-r-2"></td>
            <td className="w-2/12 px-2 py-2 text-center border-r-2">Certificate ID</td>
            {/* placeholder */}
            <td className="w-4/12 px-2 py-2 text-center border-r-2"></td>
          </tr>

          <tr className="border-2 border-b-0 border-r-0 border-collapse">
            <td className="w-2/12 px-2 py-2 text-center border-r-2 border-b-2">Awarded On</td>
            {/* placeholder */}
            <td className="w-4/12 px-2 py-2 text-center border-r-2 border-b-2"></td>
            <td className="w-2/12 px-2 py-2 text-center border-r-2 border-b-2">Status</td>
            {/* placeholder */}
            <td className="w-4/12 px-2 py-2 text-center border-r-2 border-b-2"></td>
          </tr>

        </tbody>
      </table>
    </div>
  );
};

export default Home;
