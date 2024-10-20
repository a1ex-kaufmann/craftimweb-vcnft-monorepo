"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";

const Admin: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <div className="flex flex-col justify-around bg-gray-100 rounded-3xl p-6 shadow-lg">
      <div className="mb-6 flex justify-center">
        <input
          type="search"
          placeholder="Find Issuer"
          className="input h-10 w-96 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
      </div>

      <div className="flex justify-center overflow-auto px-4 max-h-64 mb-6">
        <table className="table-auto w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Issuer Name</th>
              <th className="px-4 py-2 text-left">Issuer Wallet Address</th>
              <th className="px-4 py-2 text-center">State</th>
            </tr>
          </thead>
          <tbody>
            {[
              { id: 1, name: "VTB", address: "0x1234...5678" },
              { id: 2, name: "Java Education", address: "0x2345...6789" },
              { id: 3, name: "MIT", address: "0x3456...7890" },
              { id: 4, name: "MIPT", address: "0x4567...8901" },
              { id: 5, name: "Coursera", address: "0x5678...9012" },
              { id: 6, name: "AWS", address: "0x6789...0123" },
            ].map((issuer) => (
              <tr key={issuer.id} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-2">{issuer.id}</td>
                <td className="px-4 py-2">{issuer.name}</td>
                <td className="px-4 py-2">{issuer.address}</td>
                <td className="px-4 py-2 text-center">
                  <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Issuer</h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="issuerName" className="block text-sm font-medium text-gray-700">
              Issuer Name
            </label>
            <input
              id="issuerName"
              type="text"
              placeholder="Issuer Name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>
          <div>
            <label htmlFor="issuerAddress" className="block text-sm font-medium text-gray-700">
              Issuer Wallet Address
            </label>
            <input
              id="issuerAddress"
              type="text"
              placeholder="Address"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>
          <button 
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add Issuer
          </button>
        </form>
      </div>
    </div>
  );
};

export default Admin;