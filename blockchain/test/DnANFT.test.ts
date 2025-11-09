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

    await nft.connect(admin).mintTo(owner.address, "ipfs://token1");
    expect(await nft.ownerOf(1)).to.equal(owner.address);

    const price = ethers.parseEther("0.5");
    await nft.connect(admin).setTokenPrice(1, price);
    expect(await nft.tokenPrice(1)).to.equal(price);

    await expect(nft.connect(buyer).buy(1, { value: price }))
      .to.emit(nft, "Purchased")
      .withArgs(buyer.address, 1, price);

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
    await nft.connect(admin).mintTo(owner.address, "ipfs://token1");
    await nft.connect(admin).mintTo(owner.address, "ipfs://token2");

    const [ids, owners, uris, prices] = await nft.getAllNFTs();
    expect(ids.length).to.equal(2);
    expect(owners[0]).to.equal(owner.address);
    expect(uris[0]).to.equal("ipfs://token1");
  });

  it("should revert setTokenPrice if token does not exist yet", async function () {
    const [owner, admin] = await ethers.getSigners();
    const DnANFT = await ethers.getContractFactory("DnANFT");
    const nft = await DnANFT.deploy("DnA Editorials", "DNA");
    await nft.waitForDeployment();

    await nft.connect(owner).setAdmin(admin.address, true);

    const nonExistingId = 12345;
    const price = ethers.parseEther("0.1");
    await expect(nft.connect(admin).setTokenPrice(nonExistingId, price)).to.be.revertedWith(
      "Token does not exist"
    );
  });

  it("should allow setTokenPrice only after mintTo is mined", async function () {
    const [owner, admin] = await ethers.getSigners();
    const DnANFT = await ethers.getContractFactory("DnANFT");
    const nft = await DnANFT.deploy("DnA Editorials", "DNA");
    await nft.waitForDeployment();

    await nft.connect(owner).setAdmin(admin.address, true);

    await nft.connect(admin).mintTo(owner.address, "ipfs://token1");

    const price = ethers.parseEther("0.05");
    await expect(nft.connect(admin).setTokenPrice(1, price))
      .to.emit(nft, "PriceSet")
      .withArgs(1, price);

    expect(await nft.tokenPrice(1)).to.equal(price);
  });

  it("should return only NFTs owned by the given address via getOwnedNFTs", async function () {
    const [owner, admin, other] = await ethers.getSigners();
    const DnANFT = await ethers.getContractFactory("DnANFT");
    const nft = await DnANFT.deploy("DnA Editorials", "DNA");
    await nft.waitForDeployment();

    await nft.connect(owner).setAdmin(admin.address, true);

    await nft.connect(admin).mintTo(owner.address, "ipfs://token1");
    await nft.connect(admin).mintTo(owner.address, "ipfs://token2");
    await nft.connect(admin).mintTo(other.address, "ipfs://token3");

    const [idsOwner, urisOwner, pricesOwner] = await nft.getOwnedNFTs(owner.address);
    expect(idsOwner.length).to.equal(2);
    expect(urisOwner[0]).to.equal("ipfs://token1");
    expect(urisOwner[1]).to.equal("ipfs://token2");

    expect(pricesOwner[0]).to.equal(0);

    const [idsOther, urisOther, pricesOther] = await nft.getOwnedNFTs(other.address);
    expect(idsOther.length).to.equal(1);
    expect(urisOther[0]).to.equal("ipfs://token3");
    expect(pricesOther[0]).to.equal(0);

    await nft
      .connect(owner)
      ["safeTransferFrom(address,address,uint256)"](owner.address, other.address, 1);

    const [idsOwnerAfter] = await nft.getOwnedNFTs(owner.address);
    expect(idsOwnerAfter.length).to.equal(1);

    const [idsOtherAfter] = await nft.getOwnedNFTs(other.address);
    expect(idsOtherAfter.length).to.equal(2);
  });
});
