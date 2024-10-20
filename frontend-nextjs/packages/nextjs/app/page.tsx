"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon, ComputerDesktopIcon, DocumentArrowUpIcon, WalletIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-4xl font-bold">CraftimWeb team presents</span>
            <span className="block text-2xl mb-2">Digital Certificate Management System with NFT + VC technology</span>
          </h1>

          <p className="text-center text-lg">
          Special for Moretech VTB hackaton 2024
          </p>
          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>

        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <ComputerDesktopIcon className="h-8 w-8 fill-secondary" />
              <p>
                Manage certificate issuers in the{" "}
                <Link href="/admin" passHref className="link">
                  Admin
                </Link>{" "}
                tab.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <DocumentArrowUpIcon className="h-8 w-8 fill-secondary" />
              <p>
                Issue new vc+nft certificates in the{" "}
                <Link href="/issuer" passHref className="link">
                Issuer
                </Link>{" "}
                tab.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <WalletIcon className="h-8 w-8 fill-secondary" />
              <p>
                Manage your certificate in the{" "}
                <Link href="/holder" passHref className="link">
                Holder
                </Link>{" "}
                tab.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
              <p>
                Check holder`s certificate in the{" "}
                <Link href="/verifier" passHref className="link">
                Verifier
                </Link>{" "}
                tab.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
