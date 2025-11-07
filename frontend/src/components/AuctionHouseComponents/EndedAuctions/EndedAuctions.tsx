import { AuctionCard } from '../AuctionCard/AuctionCard'
import type { EndedAuctionsProps } from '../../../types/auction'
import styles from './EndedAuctions.module.css'

export function EndedAuctions({ auctions }: EndedAuctionsProps) {
  if (auctions.length === 0)
    return <p className={styles.empty}>No ended auctions.</p>

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Ended Auctions</h2>
      <div className={styles.list}>
        {auctions.map(auction => (
          <AuctionCard key={auction.id} auction={auction} />
        ))}
      </div>
    </section>
  )
}
