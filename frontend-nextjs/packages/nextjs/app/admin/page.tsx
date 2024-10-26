"use client";

import Link from "next/link";
import type { NextPage } from "next";
import React, { useState, useEffect, useMemo } from 'react';
import { useAccount, useWalletClient } from "wagmi";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";
import Tree from 'react-d3-tree';

const Admin: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [issuers, setIssuers] = useState([]);
  const [cursor, setCursor] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [newIssuerAddress, setNewIssuerAddress] = useState('');
  const [treeData, setTreeData] = useState({ name: 'Root', children: [] });

  const { data: vcNFTIssuerHierarchy, isLoading: isLoadingVCNFTIssuerHierarchy } = useScaffoldContract({
    contractName: "VCNFTCore",
    walletClient
  });


  const prepareTreeData = (issuers) => {
    // Create nodes map
    const nodesMap = new Map();
    issuers.forEach(issuer => {
      nodesMap.set(issuer.wallet, {
        name: `${issuer.wallet.slice(0, 6)}...${issuer.wallet.slice(-4)}`,
        attributes: {
          status: issuer.status == 1 ? 'Active' : 'Disabled'
        },
        children: []
      });
    });

    // Build tree structure
    const root = { name: 'Root', children: [], attributes: { status: 'Active' } };
    issuers.forEach(issuer => {
      const node = nodesMap.get(issuer.wallet);
      if (issuer.parent === '0x0000000000000000000000000000000000000000') {
        root.children.push(node);
      } else {
        const parentNode = nodesMap.get(issuer.parent);
        if (parentNode) {
          parentNode.children.push(node);
        }
      }
    });

    return root;
  };

  const fetchIssuers = async () => {
    if (vcNFTIssuerHierarchy) {
      try {
        const [fetchedIssuers, newCursor] = await vcNFTIssuerHierarchy.read.fetchIssuers([0, 10]);
        const issuerList: any = fetchedIssuers;
        setIssuers(issuerList);
        setTreeData(prepareTreeData(issuerList));
      } catch (error) {
        console.error("err:", error);
      }
    }
  };

  useEffect(() => {
    fetchIssuers();

    const interval = setInterval(fetchIssuers, 5000);
    return () => clearInterval(interval);
  }, [isLoadingVCNFTIssuerHierarchy]);

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

  // Create stable ID for tree
  const treeId = useMemo(() => 'issuer-hierarchy-tree', []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Issuer Hierarchy</h1>
          <p className="text-gray-600">Manage and view your issuer network structure</p>
        </div>

        {/* Graph visualization */}
        <div className="mb-6 flex justify-center">
          <div className="w-[600px] h-[300px] bg-white rounded-lg shadow-lg overflow-hidden">
            <Tree 
              id={treeId}
              data={treeData}
              orientation="vertical"
              pathFunc="step"
              translate={{ x: 300, y: 20 }}
              nodeSize={{ x: 60, y: 40 }}
              separation={{ siblings: 2, nonSiblings: 2 }}
              renderCustomNodeElement={(rd3tProps) => (
                <g>
                  <circle r={10} fill={rd3tProps.nodeDatum.attributes?.status === 'Active' ? '#4CAF50' : '#FF5252'} />
                  <text x={15} y={5} style={{ fontSize: '12px' }}>
                    {rd3tProps.nodeDatum.name}
                  </text>
                </g>
              )}
            />
          </div>
        </div>

        {/* Search input */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-96">
            <input
              type="search"
              placeholder="Search by wallet address"
              className="input h-12 w-full pl-4 pr-10 rounded-lg border border-gray-300 bg-white shadow-sm 
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              value={searchTerm}
              onChange={handleSearch}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex justify-center mb-8">
          <div className="w-[1200px] bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Issuer List</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[500px]">
                      Issuer wallet
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[500px]">
                      Issuer parent
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      State
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredIssuers.map((issuer, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 font-medium">
                        {issuer.wallet}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                        {issuer.parent}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium
                          ${issuer.status == 1 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'}`}>
                          {issuer.status == 1 ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Add new issuer form */}
        <div className="flex justify-center">
          <div className="w-[600px] bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Add New Issuer</h2>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label htmlFor="issuerAddress" className="block text-xs font-medium text-gray-700 mb-2">
                  Issuer Wallet Address
                </label>
                <input
                  id="issuerAddress"
                  type="text"
                  placeholder="Enter wallet address"
                  className="input h-12 w-full px-4 rounded-lg border border-gray-300 focus:border-blue-500 
                           focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  value={newIssuerAddress}
                  onChange={(e) => setNewIssuerAddress(e.target.value)}
                />
              </div>
              <button 
                type="submit"
                onClick={handleAddIssuer}
                className="w-full h-12 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                         transition-colors duration-200"
              >
                Add Issuer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
