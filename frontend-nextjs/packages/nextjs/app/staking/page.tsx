"use client";

import { useEffect, useState, useCallback } from "react";
import { useAccount, useWalletClient } from "wagmi";
import type { NextPage } from "next";
import { SparklesIcon, ClipboardIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

const REFRESH_INTERVAL = 3000;

// Mock contract ABI and address - replace with actual contract details
const contractABI = [
  "function stake(uint256 tokenId, bytes zkProof) public",
  "function unstake(uint256 tokenId) public",
  "function claimRewards() public",
  "function getStakedNFTs(address account) public view returns (uint256[])",
  "function getUnstakedNFTs(address account) public view returns (uint256[])",
  "function getRewards(address account) public view returns (uint256)",
  "function getTotalStaked() public view returns (uint256)",
  "function getStakingPeriod() public view returns (uint256)",
];
const contractAddress = "0x..."; // Replace with actual contract address

// Address component with daisy classes
const Address = ({ address }: { address: string }) => {
  const shortenedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono">{shortenedAddress}</span>
      <button onClick={() => navigator.clipboard.writeText(address)} className="btn btn-ghost btn-xs">
        <ClipboardIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const { data: walletClient } = useWalletClient();
  
  const [activeTab, setActiveTab] = useState<"stake" | "unstake" | "rewards">(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('staking_activeTab') as "stake" | "unstake" | "rewards" || "stake";
    }
    return "stake";
  });

  const [selectedNFTToStake, setSelectedNFTToStake] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('staking_selectedNFTToStake') || "";
    }
    return "";
  });

  const [selectedNFTToUnstake, setSelectedNFTToUnstake] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('staking_selectedNFTToUnstake') || "";
    }
    return "";
  });

  const [zkProof, setZkProof] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('staking_zkProof') || "";
    }
    return "";
  });

  // Сохраняем значения при их изменении
  useEffect(() => {
    localStorage.setItem('staking_activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('staking_selectedNFTToStake', selectedNFTToStake);
  }, [selectedNFTToStake]);

  useEffect(() => {
    localStorage.setItem('staking_selectedNFTToUnstake', selectedNFTToUnstake);
  }, [selectedNFTToUnstake]);

  useEffect(() => {
    localStorage.setItem('staking_zkProof', zkProof);
  }, [zkProof]);

  // contracts
  const { data: stakeNFTContract, isLoading: isLoadingStakeContract } = useScaffoldContract({
    contractName: "StakeNFT",
    walletClient
  });

  const { data: nftContract, isLoading: isLoadingNFTContract } = useScaffoldContract({
    contractName: "VCNFTCore",
    walletClient,
  }); 

  interface StakerInfo {
    stakedTokens: string[];
    lastUpdateTime: number;
    rewards: bigint;
    isStaking: boolean;
  }

  const [isLoadingNFTs, setIsLoadingNFTs] = useState(false);
  const [unstakedNFTs, setUnstakedNFTs] = useState<string[]>([]);
  const [totalStaked, setTotalStaked] = useState(0);
  const [stakerInfo, setStakerInfo] = useState<StakerInfo>(null);

  // Add fetch function
  const fetchUnstakedNFTs = async () => {
    if (!nftContract || !connectedAddress) return;
    
    try {
      const nfts = await nftContract.read.getUserTokens([connectedAddress]);
      setUnstakedNFTs(nfts);
      console.log("Unstaked NFTs:", nfts);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    }
  };

  const fetchTotalStaked = async () => {
    if (!nftContract || !stakeNFTContract?.address) return;
    const totalStaked = await nftContract?.read.balanceOf([stakeNFTContract?.address]);
    setTotalStaked(Number(totalStaked));
  }

  const fetchStakerInfo = async () => {
    if (!stakeNFTContract || !connectedAddress) return;
    const stakerInfoNew = await stakeNFTContract?.read.stakers([connectedAddress]);
    console.log("stakerInfoNew", stakerInfoNew);
    setStakerInfo(stakerInfoNew);
  }

  const calculateStakingPeriod = () => {
    const stakingPeriod = stakerInfo?.lastUpdateTime;
    return stakingPeriod;
  }

  const calculateRewards = () => {
    
    return 0;
  }

  // Add refresh state and loading state
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async () => {
    if (!stakeNFTContract || !nftContract || !connectedAddress) {
      console.log("Missing dependencies:", {
        stakeNFTContract: !!stakeNFTContract,
        nftContract: !!nftContract,
        connectedAddress: !!connectedAddress
      });
      return;
    }
    
    console.log("Refreshing data...");
    await fetchUnstakedNFTs();
    await fetchTotalStaked();
    await fetchStakerInfo();
  };

  // Manual refresh function
  const handleManualRefresh = useCallback(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (stakeNFTContract && nftContract && connectedAddress) {
      // Делаем только первоначальную загрузку данных
      fetchData();

      // Убираем интервал
      // const interval = setInterval(fetchData, REFRESH_INTERVAL);
      // return () => clearInterval(interval);
    }
  }, [isLoadingStakeContract, isLoadingNFTContract]);

  // // Contract Writes
  // const { writeAsync: stakeNFT, isLoading: isStaking } = useScaffoldContract({
  //   contractName: "YourContract",
  //   functionName: "stake",
  //   args: [selectedNFTToStake, zkProof],
  //   onSuccess: () => {
  //     notification.success("NFT Staked Successfully!");
  //     setSelectedNFTToStake("");
  //     setZkProof("");
  //   },
  //   onError: (error) => {
  //     notification.error("Error Staking NFT");
  //     console.error("Staking error:", error);
  //   },
  // });

  // const { writeAsync: unstakeNFT, isLoading: isUnstaking } = useScaffoldContractWrite({
  //   contractName: "YourContract",
  //   functionName: "unstake",
  //   args: [selectedNFTToUnstake],
  //   onSuccess: () => {
  //     notification.success("NFT Unstaked Successfully!");
  //     setSelectedNFTToUnstake("");
  //   },
  // });

  // const { writeAsync: claimRewards, isLoading: isClaiming } = useScaffoldContractWrite({
  //   contractName: "YourContract",
  //   functionName: "claimRewards",
  //   onSuccess: () => {
  //     notification.success("Rewards Claimed Successfully!");
  //   },
  //   onError: (error) => {
  //     notification.error("Error Claiming Rewards");
  //     console.error("Claiming rewards error:", error);
  //   },
  // });

  const stakeNFT = async () => {
    if (!stakeNFTContract || !selectedNFTToStake || !zkProof) {
      notification.error("Missing required data for staking");
      return;
    }

    try {
      // Парсим JSON из zkProof
      const proofData = JSON.parse(zkProof);
      
      // Подготавливаем параметры для вызова контракта
      const fields = {
        tokenId: BigInt(selectedNFTToStake),
        tokenOwner: connectedAddress,
        fieldName: BigInt(proofData.publicSignals[1]), // Берем fieldName из публичных сигналов
        minValue: BigInt(proofData.publicSignals[2]), // Минимальное значение из публичных сигналов
        maxValue: BigInt(proofData.publicSignals[3])  // Максимальное значение из публичных сигналов
      }

      // Подготавливаем параметры ZK-доказательства
      const _pA = [
        BigInt(proofData.proof.pi_a[0]),
        BigInt(proofData.proof.pi_a[1])
      ];
      
      const _pB = [
        [BigInt(proofData.proof.pi_b[0][1]), BigInt(proofData.proof.pi_b[0][0])],
        [BigInt(proofData.proof.pi_b[1][1]), BigInt(proofData.proof.pi_b[1][0])]
      ];
      
      const _pC = [
        BigInt(proofData.proof.pi_c[0]),
        BigInt(proofData.proof.pi_c[1])
      ];

      console.log(BigInt(selectedNFTToStake));
      try {
        await stakeNFTContract.read.stake([
          fields,
          _pA,
          _pB,
          _pC,
          proofData.publicSignals
        ],
        {
          account: connectedAddress // указываем аккаунт, от имени которого делаем вызов
        });

        const tx = await stakeNFTContract.write.stake([
          fields,
        _pA, 
          _pB,
          _pC,
          proofData.publicSignals
        ]);

        notification.success("NFT Staking transaction submitted!");
        fetchData();
        
        // await tx.wait();
        // notification.success("NFT Staked Successfully!");
      } catch (error) {
        console.error("Error staking NFT:", error);
        notification.error(
          "Error Staking NFT, reason: " + error.message.slice(0, 140) + "..."
        );
      }
    
    } catch (error) {
      console.error("Error staking NFT:", error);
      notification.error(
        error.message || "Error Staking NFT"
      );
    }
  };

  const claimRewards = async () => {
    if (!stakeNFTContract) {
      notification.error("Contract not initialized");
      return;
    }

    try {
      await stakeNFTContract.read.claimRewards({
        account: connectedAddress
        });
      const tx = await stakeNFTContract.write.claimRewards();
      
      notification.success("Claim rewards transaction submitted!");
      
      // await tx.wait();
      
      fetchData();
      // notification.success("Rewards Claimed Successfully!");
    } catch (error) {
      console.error("Error claiming rewards:", error);
      notification.error(
        error.message || "Error Claiming Rewards"
      );
    }
  };

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="card w-full max-w-4xl bg-base-100 shadow-xl rounded-none">
        <div className="card-body">
          <div className="flex justify-between items-center">
            <h2 className="card-title text-4xl font-bold">NFT Staking Vault</h2>
          </div>
          <p className="opacity-70">ONLY FOR 50+ EXPERIENCE</p>

          {/* Stats Section moved up */}
          <div className="mt-6 space-y-4 w-full">
            <div className="stats shadow w-full rounded-none">
              <div className="stat">
                <div className="stat-title">Staking Period</div>
                <div className="stat-value text-primary">
                  {calculateStakingPeriod() ? `${calculateStakingPeriod()} days` : "-"}
                </div>
              </div>

              <div className="stat">
                <div className="stat-title">Total NFTs Staked</div>
                <div className="stat-value text-secondary">
                  {totalStaked ? totalStaked.toString() : "0"} Tokens
                </div>
              </div>
            </div>
          </div>

          <div className="tabs tabs-boxed justify-center my-4 rounded-none">
            <a className={`tab rounded-none ${activeTab === "stake" ? "tab-active" : ""}`} onClick={() => setActiveTab("stake")}>Stake</a>
            {/* <a className={`tab rounded-none ${activeTab === "unstake" ? "tab-active" : ""}`} onClick={() => setActiveTab("unstake")}>Unstake</a> */}
            <a className={`tab rounded-none ${activeTab === "rewards" ? "tab-active" : ""}`} onClick={() => setActiveTab("rewards")}>Rewards</a>
          </div>

          {/* Content based on active tab */}
          {activeTab === "stake" && (
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Select NFT to Stake</span>
                </label>
                <select className="select select-bordered w-full rounded-none" 
                        value={selectedNFTToStake} 
                        onChange={(e) => setSelectedNFTToStake(e.target.value)}>
                  <option disabled value="">
                    {isLoadingNFTs ? "Loading..." : unstakedNFTs?.length === 0 ? "No NFTs available" : "Select an NFT"}
                  </option>
                  {unstakedNFTs?.map((nft: string) => (
                    <option key={nft} value={nft}>NFT #{nft.toString()}</option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">ZK-Proof</span>
                </label>
                <textarea 
                  placeholder="Enter ZK-proof" 
                  className="textarea textarea-bordered h-24 rounded-none"
                  value={zkProof}
                  onChange={(e) => setZkProof(e.target.value)} 
                />
              </div>

              <button 
                className="btn btn-primary w-full rounded-none" 
                onClick={stakeNFT} 
                disabled={!selectedNFTToStake || !zkProof}
              >
                {isRefreshing ? (
                  <>
                    <ArrowPathIcon className="h-4 w-4 animate-spin mr-2" />
                    Staking...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="h-4 w-4 mr-2" />
                    Stake NFT
                  </>
                )}
              </button>
            </div>
          )}

          {activeTab === "unstake" && (
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Select NFT to Unstake</span>
                </label>
                <select className="select select-bordered w-full rounded-none" 
                        value={selectedNFTToUnstake} 
                        onChange={(e) => setSelectedNFTToUnstake(e.target.value)}>
                  <option disabled value="">Select an NFT</option>
                  {stakerInfo?.stakedTokens?.map((nft: string) => (
                    <option key={nft} value={nft}>NFT #{nft}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {activeTab === "rewards" && (
            <div className="space-y-4">
              <div className="stats shadow w-full rounded-none">
                <div className="stat">
                  {/* <div className="stat-title">Claimable Rewards</div> */}
                  {/* <div className="stat-value">{stakerInfo?.rewards?.toString() || "0"}</div> */}
                  <div className="stat-actions">
                    <button 
                      className="btn btn-primary w-full rounded-none mt-4" 
                      onClick={claimRewards}
                      // disabled={!stakerInfo?.lastUpdateTime}
                    >
                      <SparklesIcon className="h-4 w-4 mr-2" />
                      Claim Rewards
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stats Section */}
          <div className="mt-6 space-y-4">

            <div className="alert rounded-none">
              <div>
                <span className="font-bold">Connected Address:</span>
                {connectedAddress && <Address address={connectedAddress} />}
              </div>
            </div>

            {/* Add refresh button in JSX where needed: */}
            <button 
              className="btn btn-ghost btn-circle rounded-none" 
              onClick={handleManualRefresh}
              // disabled={isRefreshing}
            >
              {/* <ArrowPathIcon className={`h-6 w-6 ${isRefreshing ? 'animate-spin' : ''}`} /> */}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Home;
