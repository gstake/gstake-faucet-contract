const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('EthereumFaucet Contract', function () {
  let Faucet
  let faucet
  let owner
  let addr1
  let addr2
  let token
  let tokenAmount = ethers.parseUnits('1000', 'ether') // 假设代币有18个小数位
  let ethAmount = ethers.parseUnits('0.01', 'ether')

  beforeEach(async function () {
    ;[owner, addr1, addr2] = await ethers.getSigners()

    // 部署 ERC20 代币合约
    const Token = await ethers.getContractFactory('TestToken')
    token = await Token.deploy('TestToken', 'TT', 10000000000)
    // await token.deployed()

    // 发放代币给 Faucet 合约
    await token.mint(owner.address, tokenAmount)

    // 部署 Faucet 合约，传递初始所有者地址
    Faucet = await ethers.getContractFactory('EthereumFaucet')
    faucet = await Faucet.deploy(token.address, tokenAmount, ethAmount, owner.address)
    // await faucet.deployed()

    // 转移代币到 Faucet 合约
    await token.transfer(faucet.address, tokenAmount)
  })

  describe('requestTokens', function () {
    it('Should give tokens to the caller', async function () {
      // 测试领取功能
      await faucet.connect(addr1).requestTokens()
      expect(await token.balanceOf(addr1.address)).to.equal(tokenAmount)
      expect(await ethers.provider.getBalance(addr1.address)).to.be.closeTo(
        ethAmount,
        ethers.parseUnits('0.001', 'ether'), // 考虑到交易费用
      )
    })

    it('Should not allow to request twice within 24 hours', async function () {
      // 测试 24 小时限制
      await faucet.connect(addr1).requestTokens()
      await expect(faucet.connect(addr1).requestTokens()).to.be.revertedWith('Wait 24h')
    })
  })

  describe('Admin functions', function () {
    it('Should allow owner to pause and unpause the faucet', async function () {
      // 测试暂停和恢复功能
      await faucet.connect(owner).pauseFaucet()
      await expect(faucet.connect(addr1).requestTokens()).to.be.revertedWith('Faucet is paused')

      await faucet.connect(owner).unpauseFaucet()
      await faucet.connect(addr1).requestTokens()
      expect(await token.balanceOf(addr1.address)).to.equal(tokenAmount)
    })

    it('Should allow owner to change token and eth amounts', async function () {
      // 测试更改代币和 ETH 量功能
      let newTokenAmount = ethers.parseUnits('500', 'ether')
      let newEthAmount = ethers.parseUnits('0.02', 'ether')

      await faucet.connect(owner).setTokenAmount(newTokenAmount)
      await faucet.connect(owner).setEthAmount(newEthAmount)

      await faucet.connect(addr1).requestTokens()
      expect(await token.balanceOf(addr1.address)).to.equal(newTokenAmount)
      expect(await ethers.provider.getBalance(addr1.address)).to.be.closeTo(
        newEthAmount,
        ethers.parseUnits('0.001', 'ether'), // 考虑到交易费用
      )
    })
  })

  // 可以添加更多测试用例
})
