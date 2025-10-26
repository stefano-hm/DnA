import { expect } from "chai";
import { ethers } from "hardhat";

describe("DnAAuctionHouse", function () {
  it("should handle the full auction flow", async function () {
    const [owner, admin, alice, bob] = await ethers.getSigners();

    const NFT = await ethers.getContractFactory("DnANFT");
    const nft = await NFT.connect(owner).deploy("DnA Editorials", "DNA");
    await nft.waitForDeployment();

    await nft.connect(owner).setAdmin(admin.address, true);
    await nft.connect(admin).mintTo(owner.address, "ipfs://token1");

    const AH = await ethers.getContractFactory("DnAAuctionHouse");
    const ah = await AH.connect(owner).deploy();
    await ah.waitForDeployment();
    await ah.connect(owner).setAdmin(admin.address, true);

    await nft.connect(owner).approve(await ah.getAddress(), 1);

    const tx = await ah
      .connect(admin)
      .startAuction(await nft.getAddress(), 1, ethers.parseEther("0.1"), 120);
    const rc = await tx.wait();

    const ev = (rc!.logs as any[]).find(
      (log: any) => (log as any).fragment?.name === "AuctionStarted"
    );
    const auctionId = (ev as any)?.args?.auctionId ?? 1;

    await ah.connect(alice).bid(auctionId, { value: ethers.parseEther("0.2") });
    await ah.connect(bob).bid(auctionId, { value: ethers.parseEther("0.3") });

    const pending = await ah.pendingReturns(auctionId, alice.address);
    expect(pending).to.equal(ethers.parseEther("0.2"));

    await ethers.provider.send("evm_increaseTime", [200]);
    await ethers.provider.send("evm_mine", []);

    await expect(ah.endAuction(auctionId)).to.emit(ah, "AuctionEnded");

    await expect(ah.connect(bob).claim(auctionId)).to.emit(ah, "Claimed");
    expect(await nft.ownerOf(1)).to.equal(bob.address);

    const balBefore = await ethers.provider.getBalance(alice.address);
    const txW = await ah.connect(alice).withdraw(auctionId);
    const rcW = await txW.wait();
    const gasCost = rcW!.gasUsed * txW.gasPrice!;
    const balAfter = await ethers.provider.getBalance(alice.address);
    expect(balAfter + gasCost).to.be.closeTo(
      balBefore + ethers.parseEther("0.2"),
      ethers.parseEther("0.001")
    );
  });
});
