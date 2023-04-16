// SPDX-License-Identifier: MIT
// @author Neufi Limited (neu.fi)

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "./interfaces/IZugiftSVG.sol";
import "./interfaces/IZugiftMetadata.sol";

string constant CONTRACT_METADATA = '{"name":"Regen Bingo","description":"A win-win game for regens! The first one with a full suite takes half of the pool. The other half is donated.","image":"ipfs://QmaGjcDG48ynW9htCKshQB4HvkPBjWSPuJR7QmWaWfe7Df","external_url":"https://zugift.org"}';
contract ZugiftMetadata is IZugiftMetadata {
    IZugiftSVG public svgGenerator;

    constructor(address _svgGeneratorAddress) {
        svgGenerator = IZugiftSVG(_svgGeneratorAddress);
    }

    function generateTokenURI(
        uint256 tokenId,
        uint256 donationAmount,
        address donationAddress,
        bool isBingoFinished,
        uint256 drawTimestamp
    ) external view virtual returns (string memory) {
        string memory description = string.concat(
            'A Regen Bingo card ',
            (isBingoFinished ? 'donated' : 'donating'),
            ' (',
            Strings.toHexString(uint256(uint160(donationAddress)), 20),
            ').'
        );

        string memory externalUrl = string.concat(
            'https://zugift/cards/',
            Strings.toString(tokenId)
        );

        string memory json = string.concat(
            '{"name":"Zugift #',
            Strings.toString(tokenId),
            '","description":"',
            description,
            '","external_url":"',
            externalUrl,
            ',"image":"',
            _generateImageStringFraction(
                tokenId,
                donationAmount,
                donationAddress,
                isBingoFinished,
                drawTimestamp
            ),
            '"}'
        );
        return string.concat('data:application/json;base64,', Base64.encode(bytes(json)));
    }

    function generateContractURI() external pure returns (string memory) {
        return string.concat('data:application/json;base64,', Base64.encode(bytes(CONTRACT_METADATA)));
    }

    function _generateImageStringFraction(
        uint256 tokenId,
        uint256 donationAmount,
        address donationAddress,
        bool isBingoFinished,
        uint256 drawTimestamp
    ) internal view returns (string memory) {
        string memory svg = svgGenerator.generateTokenSVG(
            tokenId,
            donationAmount,
            donationAddress,
            isBingoFinished,
            drawTimestamp
        );
        return string.concat('data:application/json;base64,', Base64.encode(bytes(svg)));
    }
}
