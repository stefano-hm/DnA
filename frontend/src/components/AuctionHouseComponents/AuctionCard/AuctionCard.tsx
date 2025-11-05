import { useState } from 'react'
import styles from './AuctionCard.module.css'
import { Modal } from '../Modal/Modal'
import { BidForm } from '../BidForm/BidForm'

interface AuctionCardProps {
  auction: {
    id: number
    title: string
    image: string
    currentBid: string
    startingBid: string
    highestBid: string
    endTime: number
    endsIn: string
  }
}

export function AuctionCard({ auction }: AuctionCardProps) {
  const [isBidOpen, setIsBidOpen] = useState(false)

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

        <button className={styles.button} onClick={() => setIsBidOpen(true)}>
          Place a Bid
        </button>
      </div>

      <Modal
        isOpen={isBidOpen}
        onClose={() => setIsBidOpen(false)}
        title={`Place a bid for ${auction.title}`}
      >
        <BidForm
          auctionId={auction.id}
          startingBid={auction.startingBid}
          highestBid={auction.highestBid}
          endTime={auction.endTime}
          onClose={() => setIsBidOpen(false)}
        />
      </Modal>
    </div>
  )
}
