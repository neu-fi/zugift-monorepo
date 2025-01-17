// SPDX-License-Identifier: MIT
// @author Neufi Limited (neu.fi)

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "./interfaces/IZugiftSVG.sol";

contract ZugiftSVG is IZugiftSVG {
    string constant STYLES = '<style>*{stroke:black;stroke-width:1}text{font-family:Monaco;font-size:100px}.a{fill:#57b592}.b{fill:#bde4df}.c{fill:#f8ce47}.d{fill:#fcf2b1}</style>';
    uint256 constant X_OFFSET = 300;
    uint256 constant Y_OFFSET = 1000;
    string[15] BACKGROUND_COLORS = [
        "#f7ce47",
        "#ffffab",
        "#f9dbc4",
        "#f6d1b3",
        "#f7ceb6",
        "#f4bab4",
        "#f4b9af",
        "#f19fa4",
        "#ed7f6e",
        "#c8cee8",
        "#bfc5e6",
        "#66c7cc",
        "#dbffde",
        "#c0e8d8",
        "#b5e8d2"
    ];
    string[12] MONTHS = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    constructor() {
    }

    function generateTokenSVG(
        uint256 tokenId,
        uint256 donationAmount,
        address donationAddress,
        bool isBingoFinished,
        uint256 drawTimestamp
    ) external view returns (string memory) {
        // return (
        //     string(
        //         abi.encodePacked(
        //             _generateSvgTag(tokenId),
        //             _generateDefs(
        //                 donationAmount,
        //                 donationName,
        //                 donationAddress,
        //                 isBingoFinished,
        //                 drawTimestamp
        //             ),
        //             STYLES,
        //             _generatePillPattern(tokenId),
        //             _generateCard(numbersMatrix, isDrawnMatrix),
        //             '</svg>'
        //         )
        //     )
        // );
    }

    function _generateSvgTag(
        uint256 tokenId
    ) internal view returns (string memory) {
        return (
            string(
                abi.encodePacked(
                    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2200 2200" style="background-color:',
                    BACKGROUND_COLORS[tokenId % BACKGROUND_COLORS.length],
                    '">'
                )
            )
        );
    }

    function _generateDefs(
        uint256 donationAmount,
        string memory donationName,
        address donationAddress,
        bool isBingoFinished,
        uint256 drawTimestamp
    ) internal view returns (string memory) {
        return (
            string(
                abi.encodePacked(
                    '<defs><g id="p"><path fill="#02E2AC" d="M10-0 10-16A1 1 0 00-10-16L-10 0z"/><path fill="#B3FFED" d="M-10 0-10 16A1 1 18 0010 16L10-0z"/></g><g id="pbg"><use href="#p" transform="translate(1600 1733) rotate(130 442 41) scale(2,2)"/><use href="#p" transform="translate(500 2133) rotate(44 11 555) scale(2,2)"/><use href="#p" transform="translate(200 2200) rotate(20 200 200) scale(2,2)"/><use href="#p" transform="translate(1000 315) rotate(130 442 41) scale(2,2)"/><use href="#p" transform="translate(50 250) rotate(80 200 200) scale(2,2)"/><use href="#p" transform="translate(444 888) rotate(160 400 400) scale(2,2)"/><use href="#p" transform="translate(400 1700) rotate(40 67 124) scale(2,2)"/><use href="#p" transform="translate(0 550) rotate(140 11 362) scale(2,2)"/><use href="#p" transform="translate(0 1100) rotate(0 200 200) scale(3,3)"/><use href="#p" transform="translate(1733 333) rotate(299 60 60) scale(3,3)"/><use href="#p" transform="translate(1312 50) rotate(99 14 21) scale(3,3)"/><use href="#p" transform="translate(2200 1993) rotate(11 414 241) scale(3,3)"/><use href="#p" transform="translate(630 0) rotate(30 124 532) scale(3,3)"/><use href="#p" transform="translate(1750 850) rotate(60 200 200) scale(3,3)"/><use href="#p" transform="translate(0 0) rotate(310 595 381) scale(3,3)"/><use href="#p" transform="translate(300 1100) rotate(180 491 372) scale(3,3)"/><use href="#p" transform="translate(2150 650) rotate(320 713 321) scale(4,4)"/><use href="#p" transform="translate(400 400) rotate(180 700 700) scale(4,4)"/><use href="#p" transform="translate(10 155) rotate(280 412 132) scale(4,4)"/><use href="#p" transform="translate(12 93) rotate(33 241 414) scale(4,4)"/><use href="#p" transform="translate(250 1997) rotate(100 200 200) scale(4,4)"/><use href="#p" transform="translate(1114 2141) rotate(51 11 410) scale(4,4)"/><use href="#p" transform="translate(-162 1693) rotate(40 414 241) scale(4,4)"/><use href="#p" transform="translate(395 113) rotate(140 241 251) scale(4,4)"/></g><path id="pt" d="M0 0 L4800 0 Z"/><text id="t"><textPath xlink:href="#pt" textLength="2200" font-size="35">',
                    _generateRollingText(
                        donationAmount,
                        donationName,
                        donationAddress,
                        isBingoFinished,
                        drawTimestamp
                    ),
                    '<animate attributeName="startOffset" values="2400; 0" dur="20s" repeatCount="indefinite"/></textPath></text></defs>'
                )
            )
        );
    }

    function _generateRollingText(
        uint256 donationAmount,
        string memory donationName,
        address donationAddress,
        bool isBingoFinished,
        uint256 drawTimestamp
    ) internal view returns (string memory) {
        return (
            string(
                abi.encodePacked(
                    isBingoFinished ? 'Donated ' : 'Donating ',
                    _convertWEIToEtherInString(donationAmount),
                    unicode' · ',
                    donationName,
                    unicode' · ',
                    Strings.toHexString(uint256(uint160(donationAddress)), 20),
                    unicode' · ',
                    ''
                )
            )
        );
    }

    function _convertWEIToEtherInString(uint256 amount)
        internal
        pure
        returns (string memory)
    {
        string memory decimalPart;
        string memory floatingPart;

        decimalPart = Strings.toString(amount / 1 ether);

        if (amount % 1 ether == 0) {
            floatingPart = '.00';
        } else {
            bytes memory fpart = bytes(Strings.toString(amount % 1 ether));
            uint256 numberOfZeroes = 18 - fpart.length;

            bool isFirstNonZeroSeen = false;

            for (uint256 i = fpart.length; i > 0; i--) {
                if (fpart[i - 1] != bytes1('0')) {
                    isFirstNonZeroSeen = true;
                }
                if (isFirstNonZeroSeen) {
                    floatingPart = string(
                        abi.encodePacked(fpart[i - 1], floatingPart)
                    );
                }
            }

            for (uint256 i = 0; i < numberOfZeroes; i++) {
                floatingPart = string(abi.encodePacked('0', floatingPart));
            }
            floatingPart = string(abi.encodePacked('.', floatingPart));
        }
        return string(abi.encodePacked(decimalPart, floatingPart, ' ETH'));
    }

    function _generateCard(
        uint8[9][3] calldata numbersMatrix,
        bool[9][3] calldata isDrawnMatrix
    ) internal view returns (string memory) {
        return (
            string(
                abi.encodePacked(
                    '<pattern id="bg" width="0.111111111111" height="0.333333333333"><polygon class="a" points="0,0 0,200 200,200"/><polygon class="c" points="0,0 200,0 200,200"/><rect class="d" x="20" y="20" width="160" height="160"/></pattern><g><polygon style="stroke-width: 20" points="200,600 200,1600 2000,1600 2000,600"/><rect fill="url(#bg)" x="200" y="900" width="1800" height="600"/>',
                    _generateNumbers(numbersMatrix, isDrawnMatrix),
                    '<polygon class="b" points="200,600 200,900 2000,900 2000,600"/><polygon class="c" points="200,600 200,900 350,750"/><polygon class="c" points="2000,600 2000,900 1850,750"/><rect class="d" x="220" y="620" width="1760" height="260"/><text x="1100" y="750" dominant-baseline="middle" text-anchor="middle" style="font-size:150">Zugift</text><polygon class="b" points="200,1500 200,1600 2000,1600 2000,1500"/><polygon class="a" points="200,1500 200,1600 250,1550"/><polygon class="a" points="2000,1500 2000,1600 1950,1550"/><rect class="d" x="220" y="1520" width="1760" height="60"/><clipPath id="clip"><rect x="230" y="1520" width="1740" height="60"/></clipPath><g clip-path="url(#clip)"><use x="-1900" y="1560" href="#t"/><use x="500" y="1560" href="#t"/></g></g>'
                )
            )
        );
    }

    function _generateNumbers(
        uint8[9][3] calldata numbersMatrix,
        bool[9][3] calldata isDrawnMatrix
    ) internal pure returns (string memory output) {
        for (uint256 row = 0; row < 3; row++) {
            for (uint256 column = 0; column < 9; column++) {
                if (0 < numbersMatrix[row][column]) {
                    output = string(
                        abi.encodePacked(
                            output,
                            _generateNumberSVG(
                                row,
                                column,
                                numbersMatrix[row][column],
                                isDrawnMatrix[row][column]
                            )
                        )
                    );
                }
            }
        }
    }

    function _generateNumberSVG(
        uint256 y,
        uint256 x,
        uint256 number,
        bool isDrawn
    ) internal pure returns (string memory) {
        uint256 centerX = x * 200 + X_OFFSET;
        uint256 centerY = y * 200 + Y_OFFSET;

        string memory numberSVG = string(
            abi.encodePacked(
                '<text dominant-baseline="middle" text-anchor="middle" x="',
                Strings.toString(centerX),
                '" y="',
                Strings.toString(centerY + 10),
                '">',
                Strings.toString(number),
                '</text>'
            )
        );

        if (isDrawn) {
            return string(
                abi.encodePacked(
                    '<circle fill="#c24f64" style="stroke-width: 0" cx="',
                    Strings.toString(centerX),
                    '" cy="',
                    Strings.toString(centerY),
                    ' "r="72"></circle>',
                    numberSVG
                )
            );
        } else {
            return numberSVG;
        }
    }

    function _generatePillPattern(uint256 tokenId)
        internal
        pure
        returns (string memory)
    {
        return
            string(
                abi.encodePacked(
                    '<use href="#pbg" class="rotate" transform="rotate(',
                    Strings.toString(
                        uint256(keccak256(abi.encodePacked(tokenId))) % 360
                    ),
                    ' 1100 1100)"/>'
                )
            );
    }
}
