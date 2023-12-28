const hre = require('hardhat');
const fs = require('fs');

async function main() {
  // 获取 Solidity 编译器的输入配置
  const input = await hre.artifacts.getBuildInfo('contracts/EthereumFaucet');

  if (input) {
    // 获取 Standard JSON Input
    const standardJsonInput = input.input;

    // 将 JSON Input 写入文件
    fs.writeFileSync('standardJsonInput.json', JSON.stringify(standardJsonInput, null, 2));
  } else {
    console.error('编译信息未找到');
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
