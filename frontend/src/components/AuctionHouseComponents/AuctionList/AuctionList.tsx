import { useEffect, useState } from 'react'
import { useReadContract } from 'wagmi'
import { contractsConfig } from '../../../contracts/contractsConfig.ts'
import { AuctionCard } from '../AuctionCard/AuctionCard'
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
}

export function AuctionList() {
  const { address: contractAddress, abi } = contractsConfig.DnAAuctionHouse
  const [auctions, setAuctions] = useState<Auction[]>([])

  const { data: auctionCount } = useReadContract({
    address: contractAddress,
    abi,
    functionName: 'auctionCount',
  })

  useEffect(() => {
    if (!auctionCount) return

    async function fetchAuctions() {
      const ethers = await import('ethers')
      const provider = new ethers.BrowserProvider(window.ethereum)
      const contract = new ethers.Contract(contractAddress, abi, provider)

      const auctionsData: Auction[] = []
      for (let i = 1; i <= Number(auctionCount); i++) {
        const a = await contract.auctions(i)
        auctionsData.push({
          id: i,
          nft: a.nft,
          tokenId: Number(a.tokenId),
          startingBid: ethers.formatEther(a.startingBid),
          highestBid: ethers.formatEther(a.highestBid),
          endTime: Number(a.endTime),
          active: a.active,
          highestBidder: a.highestBidder,
        })
      }

      const active = auctionsData.filter(a => a.active)
      setAuctions(active)
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
            title: `NFT #${auction.tokenId}`,
            image: '/placeholder.jpg',
            currentBid: `${auction.highestBid} ETH`,
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
