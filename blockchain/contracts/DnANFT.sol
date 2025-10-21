// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract DnANFT is ERC721URIStorage, Ownable, ReentrancyGuard {
  mapping(address => bool) public isAdmin;
  mapping(uint256 => uint256) public tokenPrice;

  event AdminUpdated(address indexed admin, bool enabled);
  event Minted(address indexed to, uint256 indexed tokenId, string uri);
  event PriceSet(uint256 indexed tokenId, uint256 price);
  event Purchased(address indexed buyer, uint256 indexed tokenId, uint256 price);

  constructor(
    string memory name_,
    string memory symbol_
  ) ERC721(name_, symbol_) Ownable(msg.sender) {}

  function setAdmin(address account, bool enabled) external onlyOwner {
    isAdmin[account] = enabled;
    emit AdminUpdated(account, enabled);
  }

  modifier onlyAdmin() {
    require(msg.sender == owner() || isAdmin[msg.sender], "Not admin");
    _;
  }

  function mintTo(address to, uint256 tokenId, string calldata uri) external onlyAdmin {
    require(_ownerOf(tokenId) == address(0), "Already minted");
    _safeMint(to, tokenId);
    _setTokenURI(tokenId, uri);
    emit Minted(to, tokenId, uri);
  }

  function setTokenPrice(uint256 tokenId, uint256 priceWei) external onlyAdmin {
    require(_ownerOf(tokenId) != address(0), "Token does not exist");
    tokenPrice[tokenId] = priceWei;
    emit PriceSet(tokenId, priceWei);
  }

  function buy(uint256 tokenId) external payable nonReentrant {
    uint256 price = tokenPrice[tokenId];
    require(price > 0, "Not for sale");
    require(msg.value == price, "Incorrect price");

    address seller = ownerOf(tokenId);
    require(seller != msg.sender, "Already owner");

    (bool sent, ) = payable(owner()).call{ value: msg.value }("");
    require(sent, "Payment failed");

    _transfer(seller, msg.sender, tokenId);

    tokenPrice[tokenId] = 0;

    emit Purchased(msg.sender, tokenId, price);
  }
}
