import { useState } from 'react'
import { useAccount } from 'wagmi'
import styles from './AuctionCard.module.css'
import { Modal } from '../Modal/Modal'
import { BidForm } from '../BidForm/BidForm'
import { EndAuctionButton } from '../EndAuctionButton/EndAuctionButton'
import { ClaimButton } from '../ClaimButton/ClaimButton'
import type { AuctionCardProps } from '../../../types/auction'

const ADMIN_ADDRESS = '0xCdD94FC9056554E2D3f222515fB52829572c7095'

export function AuctionCard({ auction }: AuctionCardProps) {
  const [isBidOpen, setIsBidOpen] = useState(false)
  const { address: userAddress } = useAccount()

  const isWinner =
    !!userAddress &&
    !!auction.highestBidder &&
    userAddress.toLowerCase() === auction.highestBidder.toLowerCase()

  const isAdmin =
    !!userAddress && userAddress.toLowerCase() === ADMIN_ADDRESS.toLowerCase()

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

        {auction.endsIn === 'Ended' && auction.highestBidder && (
          <p className={styles.winner}>
            Winner: {auction.highestBidder.slice(0, 6)}...
            {auction.highestBidder.slice(-4)}
          </p>
        )}

        <div className={styles.info}>
          <p className={styles.bid}>
            <span>Current bid:</span> {auction.currentBid}
          </p>
          <p className={styles.timer}>
            <span>Ends in:</span> {auction.endsIn}
          </p>
        </div>

        {auction.endsIn !== 'Ended' && (
          <button className={styles.button} onClick={() => setIsBidOpen(true)}>
            Place a Bid
          </button>
        )}

        {isAdmin && auction.endsIn === 'Ended' && (
          <EndAuctionButton auctionId={auction.id} onEnded={() => {}} />
        )}

        {isWinner && auction.endsIn === 'Ended' && (
          <ClaimButton auctionId={auction.id} onClaimed={() => {}} />
        )}
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
