interface IZugiftMetadata {
    function generateTokenURI(
        uint256 tokenId,
        uint256 donationAmount,
        address donationAddress,
        bool isBingoFinished,
        uint256 drawTimestamp
    ) external view virtual returns (string memory);

    function generateContractURI() external pure returns (string memory);
}
