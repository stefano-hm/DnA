import { AuctionCard } from '../AuctionCard/AuctionCard'
import type { EndedAuctionsProps } from '../../../types/auction'
import styles from './EndedAuctions.module.css'

export function EndedAuctions({ auctions }: EndedAuctionsProps) {
  if (auctions.length === 0)
    return <p className={styles.emptyText}>No ended auctions.</p>

  return (
    <section className={styles.endedSection}>
      <h2 className={styles.endedTitle}>Ended Auctions</h2>

      <div className={styles.endedGrid}>
        {auctions.map(auction => (
          <AuctionCard key={auction.id} auction={auction} />
        ))}
      </div>
    </section>
  )
}
