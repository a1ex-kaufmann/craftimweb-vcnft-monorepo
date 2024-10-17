// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

// inheritance
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "./interface/ISimpleAccount.sol";

// interfaces
import "@openzeppelin/contracts/interfaces/IERC721.sol";


contract SimpleAccount is Initializable, ReentrancyGuardUpgradeable, ISimpleAccount {
    address public nftContract;
    uint256 public tokenId;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address _nftContract, uint256 _tokenId) external initializer {
        nftContract = _nftContract;
        tokenId = _tokenId;
    }

    modifier onlyOwner() {
        require(msg.sender == IERC721(nftContract).ownerOf(tokenId), "SimpleAccount: not the token owner");
        _;
    }

    receive() external payable {}

    function execute(address target, uint256 value, bytes calldata data) external onlyOwner nonReentrant {
        (bool success, ) = target.call{value: value}(data);
        require(success, "SimpleAccount: transaction execution failed");
    }

    function withdrawETH(address payable to, uint256 amount) external onlyOwner nonReentrant {
        require(address(this).balance >= amount, "SimpleAccount: insufficient balance");
        to.transfer(amount);
    }
}
