import { ethers } from "hardhat";

async function main() {
  const DnANFT = await ethers.getContractFactory("DnANFT");
  const nft = await DnANFT.deploy("DnA Editorials", "DNA");
  await nft.waitForDeployment();
  console.log("DnANFT deployed to:", await nft.getAddress());

  const Auction = await ethers.getContractFactory("DnAAuctionHouse");
  const auction = await Auction.deploy();
  await auction.waitForDeployment();
  console.log("DnAAuctionHouse deployed to:", await auction.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
