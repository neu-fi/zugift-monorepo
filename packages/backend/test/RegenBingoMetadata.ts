import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("ZugiftMetadata", function () {

  async function deployZugiftMetadataFixture() {
    const DateTime = await ethers.getContractFactory("BokkyPooBahsDateTimeContract");
    const dateTime = await DateTime.deploy();

    const ZugiftSVG = await ethers.getContractFactory("ZugiftSVG");
    const zugiftSVG = await ZugiftSVG.deploy(dateTime.address);

    const ZugiftMetadata = await ethers.getContractFactory("ZugiftMetadata");
    const zugiftMetadata = await ZugiftMetadata.deploy(zugiftSVG.address);

    return { zugiftMetadata };
  }

  describe("Generate Metadata", function () {
    it("Contract URI", async function () {
      const { zugiftMetadata } = await loadFixture(deployZugiftMetadataFixture);

      const URI = await zugiftMetadata.generateContractURI();
      const splittedURI = URI.split(',')[1];
      const expectedURI = '{"name":"Regen Bingo","description":"A win-win game for regens! The first one with a full suite takes half of the pool. The other half is donated.","image":"ipfs://QmaGjcDG48ynW9htCKshQB4HvkPBjWSPuJR7QmWaWfe7Df","external_url":"https://regen.bingo"}';
      const encodedExpectedURI = Buffer.from(expectedURI).toString('base64');
      expect(encodedExpectedURI).to.equal(splittedURI);
    });

  });
});
