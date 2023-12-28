// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract EthereumFaucet is Ownable {
  IERC20 public token;
  uint256 public tokenAmount;
  uint256 public ethAmount;
  bool public isPaused = false;

  mapping(address => uint256) public lastAccessTime;

  event TokensRequested(address indexed requester, uint256 ethAmount, uint256 tokenAmount);
  event EmergencyWithdrawal(address indexed owner, uint256 ethWithdrawn, uint256 tokenWithdrawn);

  constructor(address _tokenAddress, uint256 _tokenAmount, uint256 _ethAmount, address _owner) Ownable(_owner) {
    token = IERC20(_tokenAddress);
    tokenAmount = _tokenAmount;
    ethAmount = _ethAmount;
  }

  function requestTokens() public {
    require(!isPaused, 'Faucet is paused');
    require(block.timestamp - lastAccessTime[msg.sender] > 1 days, 'Wait 24h');
    lastAccessTime[msg.sender] = block.timestamp;

    require(address(this).balance >= ethAmount, 'Not enough ETH');
    require(token.balanceOf(address(this)) >= tokenAmount, 'Not enough tokens');

    payable(msg.sender).transfer(ethAmount);
    token.transfer(msg.sender, tokenAmount);

    emit TokensRequested(msg.sender, ethAmount, tokenAmount);
  }

  function setTokenAddress(address _newToken) public onlyOwner {
    token = IERC20(_newToken);
  }

  function setTokenAmount(uint256 _newAmount) public onlyOwner {
    tokenAmount = _newAmount;
  }

  function setEthAmount(uint256 _newEthAmount) public onlyOwner {
    ethAmount = _newEthAmount;
  }

  function pauseFaucet() public onlyOwner {
    isPaused = true;
  }

  function unpauseFaucet() public onlyOwner {
    isPaused = false;
  }

  function emergencyWithdraw() public onlyOwner {
    uint256 ethBalance = address(this).balance;
    uint256 tokenBalance = token.balanceOf(address(this));

    payable(owner()).transfer(ethBalance);
    token.transfer(owner(), tokenBalance);

    emit EmergencyWithdrawal(owner(), ethBalance, tokenBalance);
  }
}
