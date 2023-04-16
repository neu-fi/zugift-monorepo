// SPDX-License-Identifier: MIT
// @author Neufi Limited (neu.fi)

pragma solidity ^0.8.17;

import "erc721a/contracts/ERC721A.sol";

contract Zupass is ERC721A {

    /*//////////////////////////////////////////////////////////////
                                ENUMS
    //////////////////////////////////////////////////////////////*/

    /*//////////////////////////////////////////////////////////////
                                CONSTANTS
    //////////////////////////////////////////////////////////////*/

    /*//////////////////////////////////////////////////////////////
                        IMMUTABLE STATE VARIABLES
    //////////////////////////////////////////////////////////////*/

    /*//////////////////////////////////////////////////////////////
                             STATE VARIABLES
    //////////////////////////////////////////////////////////////*/

    mapping(uint => string) names;

    /*//////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/

    /*//////////////////////////////////////////////////////////////
                               MODIFIERS
    //////////////////////////////////////////////////////////////*/

    /*//////////////////////////////////////////////////////////////
                               CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    constructor(
        string memory _name,
        string memory _symbol
    )
        ERC721A(_name, _symbol)
    {
    }

    /*//////////////////////////////////////////////////////////////
                           EXTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function mint(address to, string calldata name) external {
        names[_nextTokenId()] = name;
        _mint(to, 1);
    }

    /*//////////////////////////////////////////////////////////////
                          EXTERNAL VIEW FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /**
     * @dev Returns an array of token IDs owned by `owner`.
     *
     * This function scans the ownership mapping and is O(`totalSupply`) in complexity.
     * It is meant to be called off-chain.
     *
     * See {ERC721AQueryable-tokensOfOwnerIn} for splitting the scan into
     * multiple smaller scans if the collection is large enough to cause
     * an out-of-gas error (10K collections should be fine).
     *
     * Taken from https://github.com/chiru-labs/ERC721A/blob/main/contracts/extensions/ERC721AQueryable.sol
     */
    function tokensOfOwner(address owner) external view returns (uint256[] memory) {
        uint256 tokenIdsLength = balanceOf(owner);
        uint256[] memory tokenIds;
        assembly {
            // Grab the free memory pointer.
            tokenIds := mload(0x40)
            // Allocate one word for the length, and `tokenIdsMaxLength` words
            // for the data. `shl(5, x)` is equivalent to `mul(32, x)`.
            mstore(0x40, add(tokenIds, shl(5, add(tokenIdsLength, 1))))
            // Store the length of `tokenIds`.
            mstore(tokenIds, tokenIdsLength)
        }
        address currOwnershipAddr;
        uint256 tokenIdsIdx;
        for (uint256 i = _startTokenId(); tokenIdsIdx != tokenIdsLength; ) {
            TokenOwnership memory ownership = _ownershipAt(i);
            assembly {
                // if `ownership.burned == false`.
                if iszero(mload(add(ownership, 0x40))) {
                    // if `ownership.addr != address(0)`.
                    // The `addr` already has it's upper 96 bits clearned,
                    // since it is written to memory with regular Solidity.
                    if mload(ownership) {
                        currOwnershipAddr := mload(ownership)
                    }
                    // if `currOwnershipAddr == owner`.
                    // The `shl(96, x)` is to make the comparison agnostic to any
                    // dirty upper 96 bits in `owner`.
                    if iszero(shl(96, xor(currOwnershipAddr, owner))) {
                        tokenIdsIdx := add(tokenIdsIdx, 1)
                        mstore(add(tokenIds, shl(5, tokenIdsIdx)), i)
                    }
                }
                i := add(i, 1)
            }
        }
        return tokenIds;
    }

    /*//////////////////////////////////////////////////////////////
                          PUBLIC VIEW FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /*//////////////////////////////////////////////////////////////
                          INTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function _startTokenId() internal view override returns (uint256) {
        return 1;
    }
}
