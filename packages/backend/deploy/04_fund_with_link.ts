import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { LinkAddress } from '../config';

const main: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();

  let linkAddress = LinkAddress || (await hre.deployments.get('LinkToken')).address;
  const LinkTokenFactory = await hre.ethers.getContractFactory("LinkToken");
  const linkContract = LinkTokenFactory.attach(linkAddress);

  // 302951757588516228 is the LINK amount for one random [Citation needed]
  const linkAmount = "302951757588516228";
  const zugiftContract = await hre.ethers.getContract("Zugift");
  
  let transaction = await linkContract.transfer(zugiftContract.address, linkAmount);
  console.log("\n");
  try {
    await transaction.wait();
    console.log(linkAmount, "LINK sent for funding regen-bingo contract");
    console.log("Rengen Bingo's balance is: ", Number(await linkContract.balanceOf(zugiftContract.address)));
  } catch(err) {
    console.error(transaction);
    console.error(`Cannot fund the contract. Please send LINK to: ${zugiftContract.address}`)
  }

};

export default main;
 
export const tags = ['all', 'zugift'];
