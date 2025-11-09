// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract DnANFT is ERC721URIStorage, Ownable, ReentrancyGuard {
  mapping(address => bool) public isAdmin;
  mapping(uint256 => uint256) public tokenPrice;

  uint256 private nextId = 1;
  uint256[] private allTokenIds;

  event AdminUpdated(address indexed admin, bool enabled);
  event Minted(address indexed to, uint256 indexed tokenId, string uri);
  event PriceSet(uint256 indexed tokenId, uint256 price);
  event Purchased(address indexed buyer, uint256 indexed tokenId, uint256 price);

  constructor(
    string memory name_,
    string memory symbol_
  ) ERC721(name_, symbol_) Ownable(msg.sender) {}

  modifier onlyAdmin() {
    require(msg.sender == owner() || isAdmin[msg.sender], "Not admin");
    _;
  }

  function setAdmin(address account, bool enabled) external onlyOwner {
    isAdmin[account] = enabled;
    emit AdminUpdated(account, enabled);
  }

  function mintTo(address to, string calldata uri) external onlyAdmin {
    uint256 tokenId = nextId++;
    _safeMint(to, tokenId);
    _setTokenURI(tokenId, uri);
    allTokenIds.push(tokenId);
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

  function getAllNFTs()
    external
    view
    returns (
      uint256[] memory ids,
      address[] memory owners,
      string[] memory uris,
      uint256[] memory prices
    )
  {
    uint256 total = allTokenIds.length;
    ids = new uint256[](total);
    owners = new address[](total);
    uris = new string[](total);
    prices = new uint256[](total);

    uint256 count = 0;
    for (uint256 i = 0; i < total; i++) {
      uint256 id = allTokenIds[i];
      if (_ownerOf(id) == address(0)) continue;
      ids[count] = id;
      owners[count] = ownerOf(id);
      uris[count] = tokenURI(id);
      prices[count] = tokenPrice[id];
      count++;
    }
  }

  function getOwnedNFTs(
    address user
  ) external view returns (uint256[] memory ids, string[] memory uris, uint256[] memory prices) {
    uint256 total = allTokenIds.length;
    uint256 ownedCount = 0;

    for (uint256 i = 0; i < total; i++) {
      uint256 id = allTokenIds[i];
      if (ownerOf(id) == user) {
        ownedCount++;
      }
    }

    ids = new uint256[](ownedCount);
    uris = new string[](ownedCount);
    prices = new uint256[](ownedCount);

    uint256 index = 0;
    for (uint256 i = 0; i < total; i++) {
      uint256 id = allTokenIds[i];
      if (ownerOf(id) == user) {
        ids[index] = id;
        uris[index] = tokenURI(id);
        prices[index] = tokenPrice[id];
        index++;
      }
    }
  }
}
