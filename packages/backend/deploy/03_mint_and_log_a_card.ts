import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const main: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  if (hre.network.name !== 'ethereum' ) {
    const signers = await hre.ethers.getSigners();
    const deployer = signers[0];
    const zugiftContract = await hre.ethers.getContract("Zugift");
    let totalSupply;

    const mintPrice = await zugiftContract.mintPrice();
    
    console.log("\ntotalSupply():");
    totalSupply = (await zugiftContract.totalSupply());
    console.log(totalSupply.toString());
    
    console.log("\nMinting a card...");
    await (await zugiftContract.connect(deployer).mint(deployer.address, 1, { value: mintPrice })).wait();

    let quantity = 5;
    console.log("\nMinting", quantity, "cards...");
    await (await zugiftContract.connect(deployer).mint(deployer.address, quantity, { value: mintPrice.mul(quantity) })).wait();

    console.log("\ntotalSupply():");
    totalSupply = (await zugiftContract.totalSupply());
    console.log(totalSupply.toString());

    if ( 0 < totalSupply ) {
      let tokenURI = await zugiftContract.tokenURI(totalSupply);
      let decodedTokenURI = JSON.parse(Buffer.from(tokenURI.split(',')[1], 'base64').toString());

      console.log("\nDecoded tokenURI(tokenId):");
      console.log(decodedTokenURI);

      let decodedImage = Buffer.from(decodedTokenURI['image'].split(',')[1], 'base64').toString();

      console.log("\nDecoded image:");
      console.log(decodedImage);
    } else {
      console.error("Cannot find tokens");
    }
  }
};

export default main;
 
export const tags = ['all', 'zugift'];
