"use client";

import Link from "next/link";
import type { NextPage } from "next";
import React, { useState, useEffect } from 'react';
import { useAccount, useWalletClient } from "wagmi";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";

const Admin: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [issuers, setIssuers] = useState([]);
  const [cursor, setCursor] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [newIssuerAddress, setNewIssuerAddress] = useState('');

  const { data: vcNFTIssuerHierarchy } = useScaffoldContract({
    contractName: "VCNFTCore",
    walletClient
  });


  const fetchIssuers = async () => {
    if (vcNFTIssuerHierarchy) {
      try {
        const [fetchedIssuers, newCursor] = await vcNFTIssuerHierarchy.read.fetchIssuers([0, 10]);
        const issuerList: any = fetchedIssuers;
        setIssuers(issuerList);
      } catch (error) {
        console.error("err:", error);
      }
    }
  };

  useEffect(() => {
    fetchIssuers();
  }, [vcNFTIssuerHierarchy, cursor]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddIssuer = async (e) => {
    e.preventDefault();
    if (newIssuerAddress && vcNFTIssuerHierarchy) {
      try {
        await vcNFTIssuerHierarchy.write.addChildIssuer([newIssuerAddress]);

        setNewIssuerAddress('');
        fetchIssuers();
      } catch (error) {
        console.error("Error adding issuer:", error);
      }
    }
  };

  const filteredIssuers = issuers.filter(elem => 
    elem.wallet.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col justify-around bg-gray-100 rounded-3xl p-6 shadow-lg">
      <div className="mb-6 flex justify-center">
        <input
          type="search"
          placeholder="Search by wallet address"
          className="input h-10 w-96 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="flex justify-center overflow-auto px-4 max-h-64 mb-6">
        <table className="table-auto w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Issuer wallet</th>
              <th className="px-4 py-2 text-left">Issuer parent</th>
              <th className="px-4 py-2 text-center">State</th>
            </tr>
          </thead>
          <tbody>
            {filteredIssuers.map((issuer, index) => (
              <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-2">{issuer.wallet}</td>
                <td className="px-4 py-2">{issuer.parent}</td>
                <td className="px-4 py-2 text-center">
                  {issuer.status == 1 ? 'Active' : 'Disabled'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Add new issuer</h2>
          <div>
            <label htmlFor="issuerAddress" className="block text-sm font-medium text-gray-700">
              Issuer wallet
            </label>
            <input
              id="issuerAddress"
              type="text"
              placeholder="address"
              className="input h-10 w-96 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
              value={newIssuerAddress}
              onChange={(e) => setNewIssuerAddress(e.target.value)}
            />
          </div>
          <br />

          <button 
            type="submit"
            onClick={handleAddIssuer}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add issuer
          </button>
          
      </div>
    </div>
  );
};

export default Admin;