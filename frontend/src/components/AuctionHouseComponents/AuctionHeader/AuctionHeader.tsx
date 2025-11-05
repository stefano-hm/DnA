import styles from './AuctionHeader.module.css'

export function AuctionHeader() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Live Auctions</h1>
      <p className={styles.subtitle}>
        Explore ongoing bids and own unique DnA NFTs.
      </p>
    </header>
  )
}
