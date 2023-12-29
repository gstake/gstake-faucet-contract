// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract EthereumFaucet is Ownable {
  IERC20 public token;
  uint256 public tokenAmount;
  uint256 public ethAmount;
  bool public isPaused = false;

  mapping(address => uint256) public lastAccessTimeEth;
  mapping(address => uint256) public lastAccessTimeToken;

  event EthRequested(address indexed requester, uint256 ethAmount);
  event TokensRequested(address indexed requester, uint256 tokenAmount);
  event EmergencyWithdrawal(address indexed owner, uint256 ethWithdrawn, uint256 tokenWithdrawn);

  constructor(address _tokenAddress, uint256 _tokenAmount, uint256 _ethAmount, address _owner) Ownable(_owner) {
    token = IERC20(_tokenAddress);
    tokenAmount = _tokenAmount;
    ethAmount = _ethAmount;
  }

  receive() external payable {}

  function requestEth() public {
    require(!isPaused, 'Faucet is paused');
    require(block.timestamp - lastAccessTimeEth[msg.sender] > 1 days, 'Wait 24h for ETH');
    lastAccessTimeEth[msg.sender] = block.timestamp;

    require(address(this).balance >= ethAmount, 'Not enough ETH');
    payable(msg.sender).transfer(ethAmount);

    emit EthRequested(msg.sender, ethAmount);
  }

  function requestTokens() public {
    require(!isPaused, 'Faucet is paused');
    require(block.timestamp - lastAccessTimeToken[msg.sender] > 1 days, 'Wait 24h for tokens');
    lastAccessTimeToken[msg.sender] = block.timestamp;

    require(token.balanceOf(address(this)) >= tokenAmount, 'Not enough tokens');
    token.transfer(msg.sender, tokenAmount);

    emit TokensRequested(msg.sender, tokenAmount);
  }

  function setTokenAddress(address _newToken) public onlyOwner {
    require(_newToken != address(0), 'Invalid address');
    IERC20 newTokenContract = IERC20(_newToken);
    require(newTokenContract.totalSupply() > 0, 'Invalid ERC20 token');

    token = newTokenContract;
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

    if (ethBalance > 0) {
      payable(owner()).transfer(ethBalance);
    }

    if (tokenBalance > 0) {
      try token.transfer(owner(), tokenBalance) {} catch {}
    }

    emit EmergencyWithdrawal(owner(), ethBalance, tokenBalance);
  }

  function withdrawERC20(address _tokenAddress, address _to, uint256 _amount) public onlyOwner {
    require(_to != address(0), 'Invalid recipient address');
    IERC20 localToken = IERC20(_tokenAddress);
    uint256 balance = localToken.balanceOf(address(this));
    uint256 amount = _amount == 0 ? balance : _amount;
    require(balance >= amount, 'Insufficient balance');
    require(localToken.transfer(_to, amount), 'Failed to transfer tokens');
  }

  function withdrawERC721(address _nftAddress, address _to, uint256 _tokenId) public onlyOwner {
    require(_to != address(0), 'Invalid recipient address');

    uint32 size;
    assembly {
      size := extcodesize(_nftAddress)
    }
    require(size > 0, "The address doesn't point to a contract");

    require(IERC165(_nftAddress).supportsInterface(type(IERC721).interfaceId), 'Invalid token type');
    require(IERC721(_nftAddress).ownerOf(_tokenId) == address(this), 'Token not owned by contract');
    IERC721(_nftAddress).safeTransferFrom(address(this), _to, _tokenId, '');
  }
}
