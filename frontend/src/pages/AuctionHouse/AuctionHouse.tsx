import { useAuctionData } from '../../hooks/useAuctionData'
import { AuctionHeader } from '../../components/AuctionHouseComponents/AuctionHeader/AuctionHeader'
import { AuctionActive } from '../../components/AuctionHouseComponents/AuctionActive/AuctionActive'
import { EndedAuctions } from '../../components/AuctionHouseComponents/EndedAuctions/EndedAuctions'
import { AdminAuctionForm } from '../../components/AuctionHouseComponents/AdminAuctionForm/AdminAuctionForm'
import { useAccount } from 'wagmi'
import styles from './AuctionHouse.module.css'
import { Footer } from '../../components/HomeComponents/Footer/Footer'

const ADMIN_ADDRESS = import.meta.env.VITE_ADMIN_ADDRESS

export default function AuctionHouse() {
  const { loading, activeAuctions, endedAuctions } = useAuctionData()
  const { address: userAddress } = useAccount()

  const isAdmin =
    !!userAddress &&
    !!ADMIN_ADDRESS &&
    userAddress.toLowerCase() === ADMIN_ADDRESS.toLowerCase()

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
    <>
      <div className={styles.page}>
        <section className={styles.hero}>
          <AuctionHeader />
        </section>

        {isAdmin && (
          <div className={styles.adminSection}>
            <AdminAuctionForm />
          </div>
        )}

        <section className={styles.live}>
          <AuctionActive auctions={formattedActive} />
        </section>

        <section className={styles.ended}>
          <EndedAuctions auctions={formattedEnded} />
        </section>
      </div>
      <Footer />
    </>
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
