require('dotenv').config()
require('@nomicfoundation/hardhat-toolbox')

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.20',
  networks: {
    arbitrumSepolia: {
      // url: 'https://arbitrum-sepolia.blockpi.network/v1/rpc/public',
      url: 'https://sepolia-rollup.arbitrum.io/rpc',
      // url: 'https://arb-sepolia.g.alchemy.com/v2/nygsRS401lXLo260JSKGSnAphyIIfWVR',
      accounts: [process.env.PRIVATE_KEY],
    },
    arbitrumOne: {
      url: 'https://api.arbiscan.io/api',
      accounts: [process.env.PRIVATE_KEY],
    },
    ganache: {
      url: 'http://127.0.0.1:7545',
      chainId: 1337,
      gas: 'auto',
      gasPrice: 'auto',
    },
  },
  etherscan: {
    apiKey: {
      arbitrumOne: process.env.ARBISCAN_API_KEY,
      arbitrumGoerli: process.env.ARBISCAN_API_KEY,
      arbitrumSepolia: process.env.ARBISCAN_API_KEY,
    },
    customChains: [
      {
        network: 'arbitrumSepolia',
        chainId: 421614,
        urls: {
          apiURL: 'https://api-sepolia.arbiscan.io/api',
          browserURL: 'https://sepolia.arbiscan.io/',
        },
      },
      {
        network: 'arbitrumOne',
        chainId: 42161,
        urls: {
          apiURL: 'https://api.arbiscan.io/api',
          browserURL: 'https://arbiscan.io/',
        },
      },
    ],
  },
  sourcify: {
    enabled: true,
  },
}
