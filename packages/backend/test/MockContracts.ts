import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture, time, mine} from "@nomicfoundation/hardhat-network-helpers";
import { BigNumber } from "ethers";

const name = "Zugift";
const symbol = "BINGO";
const mintPrice = ethers.utils.parseEther("0.2") ;
const drawCooldownSeconds = 60 * 60; // 1 hour
const drawNumberCooldownMultiplier = 3; // 3 seconds per numbers drawn

describe("Chainlink contract integrations", function () {
    async function deployBingoFixture() {
        const [signer1, signer2, signer3] = await ethers.getSigners();
        const drawTimestamp = (await time.latest()) + drawCooldownSeconds;
        const donationName = "Donation Name";
        const donationAddress = signer3.address;

        // Deploymnets //

        const LinkTokenFactory = await ethers.getContractFactory("LinkToken");
        const linkToken = await LinkTokenFactory.deploy();
        await linkToken.deployed();

        const coordinatorFactory = await ethers.getContractFactory("VRFCoordinatorV2Mock");
        const vrfCoordinatorV2Mock = await coordinatorFactory.deploy(
            BigNumber.from('100000000000000000'), // 0.1 LINK
            1e9, // 0.000000001 LINK per gas
        );
        await vrfCoordinatorV2Mock.deployed();

        const mockV3AggregatorFactory = await ethers.getContractFactory("MockV3Aggregator");
        const mockV3Aggregator = await mockV3AggregatorFactory.deploy(
            18,
            BigNumber.from(String(3e16)) // 0.003
        );
        await mockV3Aggregator.deployed();

        const wrapperFactory = await ethers.getContractFactory("VRFV2Wrapper");
        const vrfV2Wrapper = await wrapperFactory.deploy(
            linkToken.address,
            mockV3Aggregator.address,
            vrfCoordinatorV2Mock.address
        );
        await vrfV2Wrapper.deployed();

        const BokkyPooBahsDateTimeContract = await ethers.getContractFactory("BokkyPooBahsDateTimeContract");
        const bokkyPooBahsBokkyPooBahsDateTimeContract = await BokkyPooBahsDateTimeContract.deploy();
        await bokkyPooBahsBokkyPooBahsDateTimeContract.deployed();

        const ZugiftSVG = await ethers.getContractFactory("ZugiftSVG");
        const zugiftSVG = await ZugiftSVG.deploy(bokkyPooBahsBokkyPooBahsDateTimeContract.address);
        await zugiftSVG.deployed();

        const ZugiftMetadata = await ethers.getContractFactory("ZugiftMetadata");
        const zugiftMetadata = await ZugiftMetadata.deploy(zugiftSVG.address);
        await zugiftMetadata.deployed();

        const Zugift = await ethers.getContractFactory("$Zugift");
        const zugift = await Zugift.deploy(
            name,
            symbol,
            mintPrice,
            drawTimestamp,
            drawNumberCooldownMultiplier,
            donationName,
            donationAddress,
            zugiftMetadata.address,
            linkToken.address,
            vrfV2Wrapper.address
        );
        await zugift.deployed();

        // Configurations //

        const wrapperGasOverhead = BigNumber.from(60_000)
        const coordinatorGasOverhead = BigNumber.from(52_000)
        const wrapperPremiumPercentage = 10
        const maxNumWords = 10

        await (await vrfV2Wrapper.setConfig(
            wrapperGasOverhead,
            coordinatorGasOverhead,
            wrapperPremiumPercentage,
            "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
            maxNumWords
        )).wait();
        
        await (await vrfCoordinatorV2Mock.fundSubscription(1, BigNumber.from(String(100 * 1e18)))).wait() // 100 LINK

        const fundWithLINK = async (_linkAmount : string) => {
            await (await linkToken.transfer(zugift.address, _linkAmount)).wait();
        }

        const provideRandomness = async (_requestId : BigNumber) => {
            const randomness = [(Math.random() * 1e10).toFixed()];

            await (await vrfCoordinatorV2Mock.fulfillRandomWordsWithOverride(
                _requestId,
                vrfV2Wrapper.address,
                randomness,
                {
                    gasLimit: 580000,
                }
            )).wait();
        }

        return { zugift, signer1, signer2, donationName, donationAddress, drawTimestamp, vrfCoordinatorV2Mock, provideRandomness, fundWithLINK};
    }
    describe("Randomness Request", async function () {
        it("Cannot get random seed before not funding with link", async function () {
            const { zugift } = await loadFixture(deployBingoFixture);

            await time.increase(drawCooldownSeconds);

            await expect(zugift.startDrawPeriod()).to.be.reverted;
            
        });
        it("Cannot get random seed with insufficent link balance", async function () {
            const { zugift, fundWithLINK } = await loadFixture(deployBingoFixture);

            const linkAmount = "302";
            await fundWithLINK(linkAmount);
            await time.increase(drawCooldownSeconds);

            await expect(zugift.startDrawPeriod()).to.be.reverted;
            
        });
        it("Should succesfully request a random word", async function () {
            const { zugift, fundWithLINK, vrfCoordinatorV2Mock } = await loadFixture(deployBingoFixture);

            const linkAmount = "302951757588516228";
            await fundWithLINK(linkAmount);
            await time.increase(drawCooldownSeconds);

            await expect(zugift.startDrawPeriod()).to.emit(vrfCoordinatorV2Mock, "RandomWordsRequested");
            expect(await zugift.$lastRequestId()).to.equal(BigNumber.from("1"));
        })
        it("Cannot rerequest random seed before drawTimestamp", async function () {
            const { zugift, fundWithLINK } = await loadFixture(deployBingoFixture);

            const linkAmount = "3029517575885162280";
            await fundWithLINK(linkAmount);

            await expect(zugift.rerequestDrawSeed()).to.be.revertedWith("Not drawing");
        });
        it("Cannot rerequest before vrf_cooldown", async function () {
            const { zugift, fundWithLINK } = await loadFixture(deployBingoFixture);

            const linkAmount = "3029517575885162280";
            await fundWithLINK(linkAmount);

            await time.increase(drawCooldownSeconds);
            await zugift.startDrawPeriod();

            const lastRequestId = await zugift.$lastRequestId();
            
            expect(lastRequestId).to.equal(BigNumber.from("1"));
            expect(await zugift.$drawSeed()).to.equal(BigNumber.from("0"));

            await zugift.rerequestDrawSeed();

            expect(await zugift.$lastRequestId()).to.equal(lastRequestId);
            
        });
        it("Cannot rerequest if drawSeed is not 0", async function () {
            const { zugift, fundWithLINK, vrfCoordinatorV2Mock, provideRandomness } = await loadFixture(deployBingoFixture);

            const linkAmount = "3029517575885162280";
            await fundWithLINK(linkAmount);

            await time.increase(drawCooldownSeconds);
            await zugift.startDrawPeriod();

            const lastRequestId = await zugift.$lastRequestId();
            
            expect(lastRequestId).to.equal(BigNumber.from("1"));
            expect(await zugift.$drawSeed()).to.equal(BigNumber.from("0"));
            
            await provideRandomness(lastRequestId);

            await mine(1000);
            
            await expect(zugift.rerequestDrawSeed()).to.not.emit(vrfCoordinatorV2Mock, "RandomWordsRequested");
            expect(await zugift.$lastRequestId()).to.equal(lastRequestId);
        })
        it("Can rerequest random seed succesfully", async function () {
            const { zugift, fundWithLINK, vrfCoordinatorV2Mock } = await loadFixture(deployBingoFixture);

            const linkAmount = "3029517575885162280";
            await fundWithLINK(linkAmount);

            await time.increase(drawCooldownSeconds);
            await zugift.startDrawPeriod();

            const lastRequestId = await zugift.$lastRequestId();
            
            expect(lastRequestId).to.equal(BigNumber.from("1"));
            expect(await zugift.$drawSeed()).to.equal(BigNumber.from("0"));

            await mine(1000);
            
            await expect(zugift.rerequestDrawSeed()).to.emit(vrfCoordinatorV2Mock, "RandomWordsRequested");
            expect(await zugift.$lastRequestId()).to.not.equal(lastRequestId);
            expect(await zugift.$lastRequestId()).to.equal(BigNumber.from("2"));
        });
    });
});
