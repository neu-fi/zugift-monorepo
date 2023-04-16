interface IZugiftSVG {
    function generateTokenSVG(
        uint256 tokenId,
        uint256 donationAmount,
        address donationAddress,
        bool isBingoFinished,
        uint256 drawTimestamp
    ) external view returns (string memory);
}
