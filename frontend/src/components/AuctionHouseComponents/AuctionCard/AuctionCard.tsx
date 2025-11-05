import styles from './AuctionCard.module.css'

interface AuctionCardProps {
  auction: {
    id: number
    title: string
    image: string
    currentBid: string
    endsIn: string
  }
}

export function AuctionCard({ auction }: AuctionCardProps) {
  return (
    <div className={styles.card}>
      <img
        src={auction.image}
        alt={auction.title}
        className={styles.image}
        loading="lazy"
      />
      <div className={styles.content}>
        <h3 className={styles.title}>{auction.title}</h3>
        <div className={styles.info}>
          <p className={styles.bid}>
            <span>Current bid:</span> {auction.currentBid}
          </p>
          <p className={styles.timer}>
            <span>Ends in:</span> {auction.endsIn}
          </p>
        </div>
        <button className={styles.button}>Place a Bid</button>
      </div>
    </div>
  )
}
