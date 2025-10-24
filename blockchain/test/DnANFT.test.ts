import { expect } from "chai";
import { ethers } from "hardhat";

describe("DnANFT", function () {
  it("should mint, set price and allow a user to buy an NFT", async function () {
    const [owner, admin, buyer, other] = await ethers.getSigners();

    const DnANFT = await ethers.getContractFactory("DnANFT");
    const nft = await DnANFT.deploy("DnA Editorials", "DNA");
    await nft.waitForDeployment();

    await nft.connect(owner).setAdmin(admin.address, true);
    expect(await nft.isAdmin(admin.address)).to.be.true;

    await nft.connect(admin).mintTo(owner.address, 1, "ipfs://token1");
    expect(await nft.ownerOf(1)).to.equal(owner.address);

    const price = ethers.parseEther("0.5");
    await nft.connect(admin).setTokenPrice(1, price);
    expect(await nft.tokenPrice(1)).to.equal(price);

    await expect(nft.connect(buyer).buy(1, { value: price })).to.emit(nft, "Purchased");

    expect(await nft.ownerOf(1)).to.equal(buyer.address);

    await nft
      .connect(buyer)
      ["safeTransferFrom(address,address,uint256)"](buyer.address, other.address, 1);

    expect(await nft.ownerOf(1)).to.equal(other.address);
  });

  it("should return all minted NFTs via getAllNFTs", async function () {
    const [owner, admin] = await ethers.getSigners();
    const DnANFT = await ethers.getContractFactory("DnANFT");
    const nft = await DnANFT.deploy("DnA Editorials", "DNA");
    await nft.waitForDeployment();

    await nft.connect(owner).setAdmin(admin.address, true);
    await nft.connect(admin).mintTo(owner.address, 1, "ipfs://token1");
    await nft.connect(admin).mintTo(owner.address, 2, "ipfs://token2");

    const [ids, owners, uris, prices] = await nft.getAllNFTs();
    expect(ids.length).to.equal(2);
    expect(owners[0]).to.equal(owner.address);
    expect(uris[0]).to.equal("ipfs://token1");
  });
});
