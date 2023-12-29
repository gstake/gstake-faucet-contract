const hre = require('hardhat')

async function main() {
  const tokenAddress = '0xf8c05dCF59E8B28BFD5eed176C562bEbcfc7Ac04'
  const tokenAmount = hre.ethers.parseUnits('10000', 18).toString()
  const ethAmount = hre.ethers.parseEther('0.01').toString()
  const ownerAddress = '0x5759349DDBa9fcd37D887929f3FB48A32e959e43'

  console.log('deployContract>>>', {
    tokenAddress,
    tokenAmount,
    ethAmount,
    ownerAddress,
  })

  const EthereumFaucet = await hre.ethers.getContractFactory('EthereumFaucet')
  const ethereumFaucet = await EthereumFaucet.deploy(tokenAddress, tokenAmount, ethAmount, ownerAddress)

  console.log(`Deployed to ${ethereumFaucet.target}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
