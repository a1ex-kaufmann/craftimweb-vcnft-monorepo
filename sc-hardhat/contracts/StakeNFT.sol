// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "./interface/IVCNFTCore.sol";

contract StakeNFT is Initializable, ERC20Upgradeable, ReentrancyGuardUpgradeable, OwnableUpgradeable {
    // Staking token (NFT) contract
    IERC721 public stakingToken;
    
    // Reward rate per second
    uint256 public constant REWARD_RATE = 1e18; // 1 token per second
    
    // Staking info for each user
    struct StakeInfo {
        uint256 lastUpdateTime;
        uint256[] stakedTokenIds;
    }
    
    mapping(address => StakeInfo) public stakers;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address _owner, address _stakingToken) public initializer {
        __ERC20_init("Reward Token", "RWD");
        __ReentrancyGuard_init();
        __Ownable_init(_owner);
        stakingToken = IERC721(_stakingToken);
    }

    // Stake NFTs
    function stake(
        IVCNFTCore.VerifyFields memory fields,
        uint[2] memory _pA,
        uint[2][2] memory _pB,
        uint[2] memory _pC,
        uint[4] memory _pubSignals
    ) external nonReentrant {
        require(fields.minValue >= 50, "StakeNFT: min value must be greater than 50");
        bool isValid = IVCNFTCore(address(stakingToken)).verifyToken(
            fields,
            _pA,
            _pB,    
            _pC,
            _pubSignals
        );

        require(isValid, "Invalid proof");
        
        _updateReward(msg.sender);
        stakingToken.transferFrom(msg.sender, address(this), fields.tokenId);
        StakeInfo storage userStake = stakers[msg.sender];
        userStake.stakedTokenIds.push(fields.tokenId);
    }

    function withdraw(uint256[] calldata tokenIds) external nonReentrant {
        StakeInfo storage userStake = stakers[msg.sender];
        
        _updateReward(msg.sender);

        for (uint256 i = 0; i < tokenIds.length; i++) {
            require(_contains(userStake.stakedTokenIds, tokenIds[i]), "Token not staked");
            stakingToken.transferFrom(address(this), msg.sender, tokenIds[i]);
            _removeTokenId(userStake.stakedTokenIds, tokenIds[i]);
        }
    }

    function claimRewards() external {
        _updateReward(msg.sender);
    }

    function _updateReward(address account) internal {
        StakeInfo storage userStake = stakers[account];
        uint256 timeElapsed = block.timestamp - userStake.lastUpdateTime;
        
        if (timeElapsed > 0 && userStake.stakedTokenIds.length > 0) {
            uint256 reward = timeElapsed * REWARD_RATE * userStake.stakedTokenIds.length;
            _mint(account, reward);
        }
        
        userStake.lastUpdateTime = block.timestamp;
    }

    function _contains(uint256[] memory array, uint256 value) internal pure returns (bool) {
        for (uint256 i = 0; i < array.length; i++) {
            if (array[i] == value) return true;
        }
        return false;
    }

    function _removeTokenId(uint256[] storage array, uint256 value) internal {
        for (uint256 i = 0; i < array.length; i++) {
            if (array[i] == value) {
                array[i] = array[array.length - 1];
                array.pop();
                break;
            }
        }
    }
}
