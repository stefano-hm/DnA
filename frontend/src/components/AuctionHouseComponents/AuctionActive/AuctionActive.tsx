import { AuctionCard } from '../AuctionCard/AuctionCard'
import type { AuctionCardProps } from '../../../types/auction'
import styles from './AuctionActive.module.css'

type AuctionActiveProps = {
  auctions: AuctionCardProps['auction'][]
}

export function AuctionActive({ auctions }: AuctionActiveProps) {
  return (
    <div className={styles.activeSection}>
      <h2 className={styles.title}>Active Auctions</h2>

      <div className={styles.grid}>
        {auctions.length === 0 ? (
          <p className={styles.empty}>No active auctions.</p>
        ) : (
          auctions.map(auction => (
            <AuctionCard key={auction.id} auction={auction} />
          ))
        )}
      </div>
    </div>
  )
}
