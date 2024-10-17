// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

interface ISimpleAccount {
    function initialize(address _nftContract, uint256 _tokenId) external;
    
    function nftContract() external view returns (address);
    
    function tokenId() external view returns (uint256);
    
    function execute(address target, uint256 value, bytes calldata data) external;
    
    function withdrawETH(address payable to, uint256 amount) external;
    
    receive() external payable;
}