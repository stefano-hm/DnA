// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IDnANFT {
  function ownerOf(uint256 tokenId) external view returns (address);
  function getApproved(uint256 tokenId) external view returns (address);
  function isApprovedForAll(address owner, address operator) external view returns (bool);
  function transferFrom(address from, address to, uint256 tokenId) external;
}

contract DnAAuctionHouse is Ownable, ReentrancyGuard {
  struct Auction {
    address nft;
    uint256 tokenId;
    address seller;
    uint256 startingBid;
    uint64 endTime;
    bool active;
    bool claimed;
    address highestBidder;
    uint256 highestBid;
  }

  mapping(uint256 => Auction) public auctions;
  uint256 public auctionCount;

  mapping(uint256 => mapping(address => uint256)) public pendingReturns;

  event AuctionStarted(
    uint256 indexed auctionId,
    address indexed nft,
    uint256 indexed tokenId,
    address seller,
    uint256 startingBid,
    uint64 endTime
  );
  event BidPlaced(uint256 indexed auctionId, address indexed bidder, uint256 amount);
  event Withdrawn(uint256 indexed auctionId, address indexed bidder, uint256 amount);
  event AuctionEnded(uint256 indexed auctionId, address winner, uint256 amount);
  event Claimed(uint256 indexed auctionId, address indexed winner);

  constructor() Ownable(msg.sender) {}

  function startAuction(
    address nft,
    uint256 tokenId,
    uint256 startingBid,
    uint64 durationSeconds
  ) external returns (uint256) {
    require(durationSeconds >= 60, "Duration too short");
    require(startingBid > 0, "Invalid starting bid");

    IDnANFT token = IDnANFT(nft);
    address currentOwner = token.ownerOf(tokenId);

    bool callerAuthorized = (msg.sender == currentOwner) ||
      (token.getApproved(tokenId) == msg.sender) ||
      (token.isApprovedForAll(currentOwner, msg.sender));

    require(callerAuthorized, "Not owner/approved");

    require(
      token.getApproved(tokenId) == address(this) ||
        token.isApprovedForAll(currentOwner, address(this)),
      "AuctionHouse not approved"
    );

    token.transferFrom(currentOwner, address(this), tokenId);

    auctionCount++;
    uint256 newId = auctionCount;

    uint64 endTime = uint64(block.timestamp + durationSeconds);
    auctions[newId] = Auction({
      nft: nft,
      tokenId: tokenId,
      seller: currentOwner,
      startingBid: startingBid,
      endTime: endTime,
      active: true,
      claimed: false,
      highestBidder: address(0),
      highestBid: 0
    });

    emit AuctionStarted(newId, nft, tokenId, currentOwner, startingBid, endTime);
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

    IDnANFT token = IDnANFT(a.nft);

    if (a.highestBidder == address(0)) {
      token.transferFrom(address(this), a.seller, a.tokenId);
      return;
    }

    (bool sent, ) = payable(a.seller).call{ value: a.highestBid }("");
    require(sent, "Payout failed");
  }

  function claim(uint256 auctionId) external nonReentrant {
    Auction storage a = auctions[auctionId];
    require(!a.active, "Auction still active");
    require(a.highestBidder != address(0), "No winner");
    require(msg.sender == a.highestBidder, "Not winner");

    require(!a.claimed, "Already claimed");
    a.claimed = true;

    IDnANFT token = IDnANFT(a.nft);
    token.transferFrom(address(this), msg.sender, a.tokenId);

    emit Claimed(auctionId, msg.sender);
  }
}
