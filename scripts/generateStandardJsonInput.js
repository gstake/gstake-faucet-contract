const hre = require('hardhat')
const fs = require('fs')

async function main() {
  const input = await hre.artifacts.getBuildInfo('contracts/EthereumFaucet')

  if (input) {
    const standardJsonInput = input.input

    fs.writeFileSync('standardJsonInput.json', JSON.stringify(standardJsonInput, null, 2))
  } else {
    console.error('Compilation information not found')
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
