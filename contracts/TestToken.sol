// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract TestToken is ERC20, Ownable {
  constructor(string memory name, string memory symbol, uint8 decimals) ERC20(name, symbol) Ownable(msg.sender) {
    _mint(msg.sender, 1000000 * (10 ** uint256(decimals))); // 初始铸造 1000000 个代币
  }

  function mint(address to, uint256 amount) public onlyOwner {
    _mint(to, amount);
  }
}