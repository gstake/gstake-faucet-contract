require('dotenv').config()
require('@nomicfoundation/hardhat-toolbox')

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.20',
  networks: {
    sepolia: {
      // url: 'https://arbitrum-sepolia.blockpi.network/v1/rpc/public',
      // url: 'https://sepolia-rollup.arbitrum.io/rpc',
      url: 'https://arb-sepolia.g.alchemy.com/v2/nygsRS401lXLo260JSKGSnAphyIIfWVR',
      accounts: [process.env.PRIVATE_KEY],
    },
    ganache: {
      url: 'http://127.0.0.1:7545',
      chainId: 1337,
      gas: 'auto',
      gasPrice: 'auto',
    },
  },
}
