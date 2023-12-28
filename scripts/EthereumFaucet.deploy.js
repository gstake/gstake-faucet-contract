const hre = require('hardhat')

async function main() {
  const tokenAddress = '0x0Bc8cd2Ca679579764EB3A037FB7B3D287b05731'
  const tokenAmount = hre.ethers.parseUnits('1000', 18).toString()
  const ethAmount = hre.ethers.parseEther('0.0001').toString()
  const ownerAddress = '0x5759349DDBa9fcd37D887929f3FB48A32e959e43'

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
