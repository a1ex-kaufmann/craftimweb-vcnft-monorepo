// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

interface IVCNFTCore {
    struct VerifyFields {
        uint256 tokenId;
        address tokenOwner;
        uint256 fieldName;
        uint256 minValue;
        uint256 maxValue;
    }

    function verifyToken(
        VerifyFields memory fields,
        uint[2] calldata _pA,
        uint[2][2] calldata _pB,
        uint[2] calldata _pC,
        uint[4] calldata _pubSignals
    ) external view returns (bool);
}
