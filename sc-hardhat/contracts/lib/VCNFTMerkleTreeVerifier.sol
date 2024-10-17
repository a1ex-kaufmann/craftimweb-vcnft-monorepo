// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// inheritance
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

// libs
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

abstract contract VCNFTMerkleTreeVerifier is Initializable {

    struct VCData {
        uint256 id;
        uint256 entropy;
        bytes32 data;
    }

    function __VCNFTMerkleTreeVerifier_init() internal initializer {}
        

    function verifyVCData(bytes32[] memory proof_, bytes32 root_, VCData memory vcData_) public view returns (bool) {
        return verifyMerkleProof(proof_, root_, keccak256(abi.encode(vcData_)));
    }

    function verifyMerkleProof(bytes32[] memory proof_, bytes32 root_, bytes32 leaf_) public view returns (bool) {
        require(root_ != bytes32(0), "VCNFTMerkleTreeVerifier: zero merkle root");
        return MerkleProof.verify(proof_, root_, leaf_);
    }

    uint256[50] private __gap;
}