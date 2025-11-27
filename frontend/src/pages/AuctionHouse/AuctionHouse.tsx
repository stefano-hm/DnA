import { useAuctionData } from '../../components/AuctionHouseComponents/AuctionList/AuctionList'
import { AuctionHeader } from '../../components/AuctionHouseComponents/AuctionHeader/AuctionHeader'
import { AuctionActive } from '../../components/AuctionHouseComponents/AuctionActive/AuctionActive'
import { EndedAuctions } from '../../components/AuctionHouseComponents/EndedAuctions/EndedAuctions'
import styles from './AuctionHouse.module.css'

export default function AuctionHouse() {
  const { loading, activeAuctions, endedAuctions } = useAuctionData()

  if (loading) return <p>Loading auctions...</p>

  const formattedActive = activeAuctions.map(a => ({
    id: a.id,
    title: a.title ?? `NFT #${a.tokenId}`,
    image: a.image ?? '/placeholder.jpg',
    currentBid: `${a.highestBid} ETH`,
    startingBid: a.startingBid,
    highestBid: a.highestBid,
    highestBidder: a.highestBidder,
    endTime: a.endTime,
    endsIn: formatEndsIn(a.endTime),
  }))

  const formattedEnded = endedAuctions.map(a => ({
    id: a.id,
    title: a.title ?? `NFT #${a.tokenId}`,
    image: a.image ?? '/placeholder.jpg',
    currentBid: `${a.highestBid} ETH`,
    startingBid: a.startingBid,
    highestBid: a.highestBid,
    highestBidder: a.highestBidder,
    endTime: a.endTime,
    endsIn: formatEndsIn(a.endTime),
  }))

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <AuctionHeader />
      </section>

      <section className={styles.live}>
        <AuctionActive auctions={formattedActive} />
      </section>

      <section className={styles.ended}>
        <EndedAuctions auctions={formattedEnded} />
      </section>
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
