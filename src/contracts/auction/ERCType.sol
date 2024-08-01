// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

/// @title ERCType
/// @dev Common types for ERC721 and ERC20 to be used in the auction contract

library ERCType {
    struct NftId {
        address tokenAddress;
        uint256 tokenId;
    }
}