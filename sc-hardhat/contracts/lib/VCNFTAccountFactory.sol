// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// inheritance
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

// interfaces
import "../interface/ISimpleAccount.sol";

// libs
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

abstract contract VCNFTAccountFactory is Initializable, OwnableUpgradeable {

    address public simpleAccountImplementation;

    //
    // constructor
    //

    function __VCNFTAccountFactory_init(address _simpleAccountImplementation) internal initializer {
        simpleAccountImplementation = _simpleAccountImplementation;
    }

    //
    // public methods
    //

    function tokenIdToAddress(uint256 tokenId_) public view returns (address) {
        return address(uint160(tokenId_));
    }

    function addressToTokenId(address account_) public view returns (uint256) {
        return uint256(uint160(account_));
    }

    function addressToDID(address address_) public view returns (string memory) {
        return string(abi.encodePacked(
            "did:ethr:",
            Strings.toString(block.chainid),
            ":",
            Strings.toHexString(uint160(address_), 20)
        ));
    }

    function tokenIdToDID(uint256 tokenId_) public view returns (string memory) {
        return addressToDID(tokenIdToAddress(tokenId_));
    }

    //
    // internal methods
    //

    function _deploySimpleAccount(bytes32 salt_) internal returns (uint256 tokenId) {
        address proxyAddress = Clones.cloneDeterministic(simpleAccountImplementation, salt_);
        uint256 newTokenId = addressToTokenId(proxyAddress);

        ISimpleAccount(payable(proxyAddress)).initialize(address(this), newTokenId);

        return newTokenId;
    }

    uint256[49] private __gap;
}
