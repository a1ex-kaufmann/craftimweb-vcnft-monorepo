// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SimpleERC721 is ERC721, Ownable {
    constructor()
        ERC721("SimpleERC721", "ERC721")
        Ownable(msg.sender)
    {}

    function safeMint(address to, uint256 tokenId) public onlyOwner {
        _safeMint(to, tokenId);
    }
}
