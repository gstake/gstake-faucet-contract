const hre = require('hardhat')

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000)
  const unlockTime = currentTimestampInSeconds + 60
  const testToken = await hre.ethers.deployContract('TestToken', ['TestToken', 'TT', 1000000])

  await testToken.waitForDeployment()

  console.log(`${unlockTime} deployed to ${testToken.target}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
