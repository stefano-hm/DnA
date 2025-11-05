import { useEffect, useState } from 'react'
import { useReadContract } from 'wagmi'
import { contractsConfig } from '../../../contracts/contractsConfig'
import { cidToGatewayUrl } from '../../../services/ipfsService'
import { AuctionCard } from '../AuctionCard/AuctionCard'
import { useWatchBids } from '../../../hooks/useWatchBids'
import styles from './AuctionList.module.css'

type Auction = {
  id: number
  tokenId: number
  startingBid: string
  highestBid: string
  endTime: number
  active: boolean
  highestBidder: string
  nft: string
  title?: string
  image?: string
}

export function AuctionList() {
  const { address: contractAddress, abi } = contractsConfig.DnAAuctionHouse
  const [auctions, setAuctions] = useState<Auction[]>([])

  const { data: auctionCount } = useReadContract({
    address: contractAddress,
    abi,
    functionName: 'auctionCount',
  })

  useWatchBids(({ auctionId, bidder, amount }) => {
    setAuctions(prev =>
      prev.map(a =>
        a.id === auctionId
          ? { ...a, highestBid: amount, highestBidder: bidder }
          : a
      )
    )
  })

  useEffect(() => {
    if (!auctionCount) return

    async function fetchAuctions() {
      const ethers = await import('ethers')
      const provider = new ethers.BrowserProvider(window.ethereum)
      const auctionContract = new ethers.Contract(
        contractAddress,
        abi,
        provider
      )

      const list: Auction[] = []

      for (let i = 1; i <= Number(auctionCount); i++) {
        const a = await auctionContract.auctions(i)
        if (!a.active) continue

        const baseAuction: Auction = {
          id: i,
          nft: a.nft,
          tokenId: Number(a.tokenId),
          startingBid: ethers.formatEther(a.startingBid),
          highestBid: ethers.formatEther(a.highestBid),
          endTime: Number(a.endTime),
          active: a.active,
          highestBidder: a.highestBidder,
        }

        try {
          const nftContract = new ethers.Contract(
            a.nft,
            ['function tokenURI(uint256 tokenId) view returns (string)'],
            provider
          )

          const tokenUri: string = await nftContract.tokenURI(a.tokenId)

          const metadataUrl = tokenUri.startsWith('ipfs://')
            ? cidToGatewayUrl(tokenUri.replace('ipfs://', ''))
            : tokenUri

          const metadata = await fetch(metadataUrl).then(res => res.json())

          const imageUrl =
            metadata.image && typeof metadata.image === 'string'
              ? metadata.image.startsWith('ipfs://')
                ? cidToGatewayUrl(metadata.image.replace('ipfs://', ''))
                : metadata.image
              : '/placeholder.jpg'

          list.push({
            ...baseAuction,
            title: metadata.name || `NFT #${baseAuction.tokenId}`,
            image: imageUrl,
          })
        } catch (err) {
          console.warn('Errore metadati asta', i, err)
          list.push({
            ...baseAuction,
            title: `NFT #${baseAuction.tokenId}`,
            image: '/placeholder.jpg',
          })
        }
      }

      setAuctions(list)
    }

    fetchAuctions()
  }, [auctionCount, contractAddress, abi])

  if (!auctionCount) return <p>Loading auctions...</p>
  if (auctions.length === 0) return <p>No active auctions found.</p>

  return (
    <div className={styles.list}>
      {auctions.map(auction => (
        <AuctionCard
          key={auction.id}
          auction={{
            id: auction.id,
            title: auction.title || `NFT #${auction.tokenId}`,
            image: auction.image || '/placeholder.jpg',
            currentBid: `${auction.highestBid} ETH`,
            startingBid: auction.startingBid,
            highestBid: auction.highestBid,
            endTime: auction.endTime,
            endsIn: formatEndsIn(auction.endTime),
          }}
        />
      ))}
    </div>
  )
}

function formatEndsIn(endTime: number): string {
  const now = Math.floor(Date.now() / 1000)
  const diff = endTime - now
  if (diff <= 0) return 'Ended'
  const hours = Math.floor(diff / 3600)
  const minutes = Math.floor((diff % 3600) / 60)
  return `${hours}h ${minutes}m`
}
