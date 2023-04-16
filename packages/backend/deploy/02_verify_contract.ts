import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { zugiftArgs, BokkyPooBahsDateTimeContractAddress, LinkAddress, WrapperAddress } from '../config';

const main: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  if (hre.network.name !== 'localhost') {
    const { deployments } = hre;

    let bokkyPooBahsBokkyPooBahsDateTimeContractAddress = BokkyPooBahsDateTimeContractAddress;
    if(bokkyPooBahsBokkyPooBahsDateTimeContractAddress == null){
      const dateTime = await deployments.get("BokkyPooBahsDateTimeContract");
      bokkyPooBahsBokkyPooBahsDateTimeContractAddress = dateTime.address;
    }

    let linkAddress = LinkAddress;
    let wrapperAddress = WrapperAddress;

    let zugiftSVG = await deployments.get("ZugiftSVG");
    let zugiftMetadata = await deployments.get("ZugiftMetadata");
    let zugift = await deployments.get("Zugift");

    console.log("Verifiying ZugiftSVG...");
    let skip0 = false;
    let counter0 = 0;
    while(!skip0 && counter0 < 10){
      try {
        counter0++;
        await hre.run("verify:verify", {
          address: zugiftSVG.address,
          constructorArguments : [bokkyPooBahsBokkyPooBahsDateTimeContractAddress]
        });
        skip0 = true;
        console.log("Verified!");
      } catch (e: any) {
        console.error(e.name);
        console.error(e.message);
        if (e.name === "NomicLabsHardhatPluginError" && e.message.toLowerCase().includes("already verified")) {
          skip0 = true;
        } else {
          console.log("Exception catched while verifying. Trying again.");
        }
      }
    }

    console.log("Verifiying ZugiftMetadata...");
    let skip1 = false;
    let counter1 = 0;
    while(!skip1 && counter1 < 10){
      try {
        counter1++;
        await hre.run("verify:verify", {
          address: zugiftMetadata.address,
          constructorArguments: [zugiftSVG.address]
        });
        skip1 = true;
        console.log("Verified!");
      } catch (e: any) {
        console.error(e.name);
        console.error(e.message);
        if (e.name === "NomicLabsHardhatPluginError" && e.message.toLowerCase().includes("already verified")) {
          skip1 = true;
        } else {
          console.log("Exception catched while verifying. Trying again.");
        }
      }
    }

    console.log("Verifiying Zugift...");
    let skip2 = false;
    let counter2 = 0;
    while(!skip2 && counter2 < 10){
      try {
        counter2++;
        await hre.run("verify:verify", {
          address: zugift.address,
          constructorArguments: [...zugiftArgs, zugiftMetadata.address, linkAddress, wrapperAddress]
        });
        skip2 = true;
        console.log("Verified!");
      } catch (e: any) {
        console.error(e.name);
        console.error(e.message);
        if (e.name === "NomicLabsHardhatPluginError" && e.message.toLowerCase().includes("already verified")) {
          skip2 = true;
        } else {
          console.log("Exception catched while verifying. Trying again.");
        }
      }
    }
  }
};

export default main;
 
export const tags = ['all', 'zugift'];
