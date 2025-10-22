// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IDnANFT {
  function ownerOf(uint256 tokenId) external view returns (address);
  function getApproved(uint256 tokenId) external view returns (address);
  function isApprovedForAll(address owner, address operator) external view returns (bool);
  function transferFrom(address from, address to, uint256 tokenId) external;
  function owner() external view returns (address);
}

contract DnAAuctionHouse is Ownable, ReentrancyGuard {
  struct Auction {
    address nft;
    uint256 tokenId;
    uint256 startingBid;
    uint64 endTime;
    bool active;
    address highestBidder;
    uint256 highestBid;
  }

  mapping(uint256 => Auction) public auctions;
  uint256 public auctionCount;

  mapping(address => bool) public isAdmin;
  mapping(uint256 => mapping(address => uint256)) public pendingReturns;

  event AdminUpdated(address indexed admin, bool enabled);
  event AuctionStarted(
    uint256 indexed auctionId,
    address indexed nft,
    uint256 indexed tokenId,
    uint256 startingBid,
    uint64 endTime
  );
  event BidPlaced(uint256 indexed auctionId, address indexed bidder, uint256 amount);
  event Withdrawn(uint256 indexed auctionId, address indexed bidder, uint256 amount);
  event AuctionEnded(uint256 indexed auctionId, address winner, uint256 amount);
  event Claimed(uint256 indexed auctionId, address indexed winner);

  constructor() Ownable(msg.sender) {}

  modifier onlyAdmin() {
    require(msg.sender == owner() || isAdmin[msg.sender], "Not admin");
    _;
  }

  function setAdmin(address account, bool enabled) external onlyOwner {
    isAdmin[account] = enabled;
    emit AdminUpdated(account, enabled);
  }

  function startAuction(
    address nft,
    uint256 tokenId,
    uint256 startingBid,
    uint64 durationSeconds
  ) external onlyAdmin returns (uint256) {
    require(durationSeconds >= 60, "Duration too short");
    require(startingBid > 0, "Invalid starting bid");

    auctionCount++;
    uint256 newId = auctionCount;

    uint64 endTime = uint64(block.timestamp + durationSeconds);
    auctions[newId] = Auction({
      nft: nft,
      tokenId: tokenId,
      startingBid: startingBid,
      endTime: endTime,
      active: true,
      highestBidder: address(0),
      highestBid: 0
    });

    emit AuctionStarted(newId, nft, tokenId, startingBid, endTime);
    return newId;
  }

  function bid(uint256 auctionId) external payable {
    Auction storage a = auctions[auctionId];
    require(a.active, "Auction not active");
    require(block.timestamp < a.endTime, "Auction ended");
    require(msg.value > a.startingBid && msg.value > a.highestBid, "Bid too low");

    if (a.highestBidder != address(0)) {
      pendingReturns[auctionId][a.highestBidder] += a.highestBid;
    }

    a.highestBidder = msg.sender;
    a.highestBid = msg.value;

    emit BidPlaced(auctionId, msg.sender, msg.value);
  }

  function withdraw(uint256 auctionId) external nonReentrant {
    uint256 amount = pendingReturns[auctionId][msg.sender];
    require(amount > 0, "Nothing to withdraw");

    pendingReturns[auctionId][msg.sender] = 0;

    (bool sent, ) = payable(msg.sender).call{ value: amount }("");
    require(sent, "Withdraw failed");

    emit Withdrawn(auctionId, msg.sender, amount);
  }

  function endAuction(uint256 auctionId) external nonReentrant {
    Auction storage a = auctions[auctionId];
    require(a.active, "Auction not active");
    require(block.timestamp >= a.endTime, "Auction not ended yet");

    a.active = false;

    emit AuctionEnded(auctionId, a.highestBidder, a.highestBid);

    if (a.highestBidder != address(0) && a.highestBid > 0) {
      IDnANFT token = IDnANFT(a.nft);
      address seller = token.owner();
      (bool sent, ) = payable(seller).call{ value: a.highestBid }("");
      require(sent, "Payout failed");
    }
  }

  function claim(uint256 auctionId) external nonReentrant {
    Auction storage a = auctions[auctionId];
    require(!a.active, "Auction still active");
    require(a.highestBidder != address(0), "No winner");
    require(msg.sender == a.highestBidder, "Not winner");

    IDnANFT token = IDnANFT(a.nft);
    token.transferFrom(address(this), msg.sender, a.tokenId);

    emit Claimed(auctionId, msg.sender);
  }
}
