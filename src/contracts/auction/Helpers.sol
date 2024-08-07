// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

library Helpers {
    /**
     * @dev Compare two strings
     * @param a The first string
     * @param b The second string
     */
    function compareStrings(
        string memory a,
        string memory b
    ) internal pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
    }

    /**
     * @dev Check if the auction is expired
     * @param _time The time to check
     */
    function checkIsExpired(uint256 _time) internal view returns (bool) {
        require(_time > 0, "Invalid time");
        return block.timestamp > _time;
    }

    /**
     * @dev Check if the address is valid
     * @param _address The address to check
     */
    function checkIsAddress(address _address) internal pure returns (bool) {
        require(_address != address(0), "Invalid address");
        return true;
    }

    function checkIsString(string memory _string) internal pure returns (bool) {
        require(bytes(_string).length > 0, "String is empty");
        return true;
    }
}
