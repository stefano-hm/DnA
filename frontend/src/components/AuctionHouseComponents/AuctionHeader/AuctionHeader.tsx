import styles from './AuctionHeader.module.css'

export function AuctionHeader() {
  return (
    <header className={styles.headerSection}>
      <h1 className={styles.headerTitle}>Live Auctions</h1>
      <p className={styles.headerSubtitle}>
        Explore ongoing bids and own unique DnA NFTs.
      </p>
    </header>
  )
}
