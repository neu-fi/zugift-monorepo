import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const main: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  if (hre.network.name !== 'ethereum' ) {
    const signers = await hre.ethers.getSigners();
    const deployer = signers[0];
    const zugiftContract = await hre.ethers.getContract("Zugift");
    let totalSupply;

    const donationAmount = await zugiftContract.donationAmount();
    
    console.log("\ntotalSupply():");
    totalSupply = (await zugiftContract.totalSupply());
    console.log(totalSupply.toString());
    
    console.log("\nMinting a Zugift...");
    await (await zugiftContract.connect(deployer).demoMint(deployer.address, { value: donationAmount })).wait();

    console.log("\ntotalSupply():");
    totalSupply = (await zugiftContract.totalSupply());
    console.log(totalSupply.toString());

    if ( 0 < totalSupply ) {
      // Uncomment when base64 url and image are returned.
      // let tokenURI = await zugiftContract.tokenURI(totalSupply);
      // let decodedTokenURI = JSON.parse(Buffer.from(tokenURI.split(',')[1], 'base64').toString());

      // // console.log("\nDecoded tokenURI(tokenId):");
      // // console.log(decodedTokenURI);

      // // let decodedImage = Buffer.from(decodedTokenURI['image'].split(',')[1], 'base64').toString();

      // // console.log("\nDecoded image:");
      // // console.log(decodedImage);
    } else {
      console.error("Cannot find tokens");
    }
  }
};

export default main;
 
export const tags = ['all', 'zugift'];
