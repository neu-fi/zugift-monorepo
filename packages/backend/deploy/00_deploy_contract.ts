import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import { parseEther } from 'ethers/lib/utils';

const main: DeployFunction = async function ({getNamedAccounts, deployments}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const greeterArgs = ['Hello!!!!!!!!'];
  await deploy('Greeter', {
    args: greeterArgs,
    from: deployer,
    log: true,
  });

  const regenBingoArgs = ['REGENBINGO', 'Regen Bingo — The OG Collection', parseEther('0.1'), Date.now() + 60, 15, deployer];
  await deploy('RegenBingo', {
    args: regenBingoArgs,
    from: deployer,
    log: true,
  });
};

export default main;
 
export const tags = ['all', 'greeter', 'regen-bingo'];
