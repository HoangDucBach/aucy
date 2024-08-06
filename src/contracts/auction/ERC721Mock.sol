// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ERC721Mock is ERC721 {
    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
    }

    function mint(address to, uint256 tokenId) public {
        _mint(to, tokenId);
    }


    // Additiona functions for minting, burning, etc., can be added here
}