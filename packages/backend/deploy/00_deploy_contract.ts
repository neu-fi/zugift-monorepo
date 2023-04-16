import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { BigNumber } from 'ethers';

const main: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deployments } = hre;
  const { deploy } = deployments;
  
  let zupass = await deploy('Zupass', {
    args: ['Zuzalu Passports', 'ZUPASS'],
    from: deployer,
    log: true,
  });

  let zugiftSVG = await deploy('ZugiftSVG', {
    args: [],
    from: deployer,
    log: true,
  });

  let zugiftMetadata = await deploy("ZugiftMetadata", {
    args: [zugiftSVG.address],
    from: deployer,
    log: true,
  });
  
  await deploy('Zugift', {
    args: [
      "ENSBound Zugift NFTs",
      "ZUGIFT",
      zupass.address,
      BigNumber.from(String(1e15)), // 0.0001 ETH
      "0x8e160C8E949967D6B797CdF2A2F38f6344a5C95f", // https://etherscan.io/name-lookup-search?id=zuzalu.eth
      zugiftMetadata.address
    ],
    from: deployer,
    log: true,
  });
};

export default main;

export const tags = ["all", "zugift"];
