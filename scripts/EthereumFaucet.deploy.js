const hre = require('hardhat')

async function main() {
  const tokenAddress = '0x0Bc8cd2Ca679579764EB3A037FB7B3D287b05731' // 代币合约地址
  const tokenAmount = '1000000000000000000000' // 假设代币有18位小数
  const ethAmount = '100000000000000' // 1 ETH，作为示例
  const ownerAddress = '0x5759349DDBa9fcd37D887929f3FB48A32e959e43' // 指定合约所有者地址
  console.log('deployContract>>>', {
    tokenAddress,
    tokenAmount,
    ethAmount,
    ownerAddress,
  })

  // 部署合约
  const EthereumFaucet = await hre.ethers.getContractFactory('EthereumFaucet')
  const ethereumFaucet = await EthereumFaucet.deploy(tokenAddress, tokenAmount, ethAmount, ownerAddress)

  console.log(`Deployed to ${ethereumFaucet.target}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
