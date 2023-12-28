// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol';
import '@openzeppelin/contracts/utils/Pausable.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol';

contract GenericE20Token is ERC20, ERC20Burnable, Pausable, Ownable, ERC20Permit {
  string private _newName;
  string private _newSymbol;
  uint256 private _maxSupply;

  event TokenNameUpdated(string newName);
  event TokenSymbolUpdated(string newSymbol);
  event MaxSupplyUpdated(uint256 maxSupply);

  constructor(
    string memory _name,
    string memory _symbol,
    uint256 maxSupply
  ) ERC20(_name, _symbol) ERC20Permit(_name) Ownable(_msgSender()) {
    _newName = _name;
    _newSymbol = _symbol;
    _maxSupply = maxSupply;
  }

  function pause() public onlyOwner {
    _pause();
  }

  function unpause() public onlyOwner {
    _unpause();
  }

  function mint(address to, uint256 amount) public onlyOwner {
    require(totalSupply() + amount <= _maxSupply, 'Total supply exceeds max supply');
    _mint(to, amount);
  }

  function updateTokenName(string memory newName) public onlyOwner {
    _newName = newName;
    emit TokenNameUpdated(newName);
  }

  function updateTokenSymbol(string memory newSymbol) public onlyOwner {
    _newSymbol = newSymbol;
    emit TokenSymbolUpdated(newSymbol);
  }

  function updateMaxSupply(uint256 maxSupply) public onlyOwner {
    _maxSupply = maxSupply;
    emit MaxSupplyUpdated(maxSupply);
  }

  function name() public view override returns (string memory) {
    if (bytes(_newName).length > 0) {
      return _newName;
    }
    return super.name();
  }

  function symbol() public view override returns (string memory) {
    if (bytes(_newSymbol).length > 0) {
      return _newSymbol;
    }
    return super.symbol();
  }

  // function _beforeTokenTransfer(address from, address to, uint256 amount) internal override whenNotPaused {
  //   super._beforeTokenTransfer(from, to, amount);
  // }

  // function _beforeTokenTransfer(address from, address to, uint256 amount) internal whenNotPaused {
  //   super._beforeTokenTransfer(from, to, amount);
  // }
}
