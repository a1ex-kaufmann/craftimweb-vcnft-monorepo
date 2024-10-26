// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// inheritance
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

// libs
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "./Groth16Verifier.sol";

abstract contract VCNFTVerifier is Initializable, Groth16Verifier {

    struct VCData {
        uint256 id;
        uint256 entropy;
        bytes32 data;
    }

    function __VCNFTVerifier_init() internal initializer {}
        

    uint256[50] private __gap;
}