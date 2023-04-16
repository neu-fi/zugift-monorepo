# Zugift
## ENSBound Zugift NFTs for funding Zuzalu through creating an endorsement network

## Development
Use Node 16+ and Yarn 3.

### Tab 1

#### Install dependencies
```
yarn
```

#### Run Hardhat Chain
```
yarn chain
```

### Tab 2
While keeping the `yarn chain` tab open, follow the instructions below in a seperate tab.

### Deploy the contract
```
yarn deploy
```
While deploying if the hardhat chain crashes due to heap allocation error, please use
`--max-memory` parameter. In order to do that, add `--max-memory <memory-size>` to the
packages/backend/package.json. 
e.g. 
```
hardhat deploy --max-memory 8192 --export-all ../frontend/contracts/hardhat_contracts.json
```

#### Run the frotnend
```
yarn dev
```

## Notes
In order to run it locally with ENS, run a local ETH mainnet fork
```
npx hardhat node --fork https://eth-mainnet.g.alchemy.com/v2/{KEY}
```

## Documentations
 * [create-web3.xyz](https://create-web3.xyz) to view the full documentation of the boilerplate.
 * [wagmi](https://wagmi.sh) to learn more about the React Hooks for Web3 integrations library.
 * [RainbowKit](https://www.rainbowkit.com/docs/introduction) for the wallet connection component.
