import { useState } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import styles from './AuctionCard.module.css'
import { Modal } from '../Modal/Modal'
import { BidForm } from '../BidForm/BidForm'
import { EndAuctionButton } from '../EndAuctionButton/EndAuctionButton'
import { ClaimButton } from '../ClaimButton/ClaimButton'
import { WithdrawButton } from '../WithdrawButton/WithdrawButton'
import { contractsConfig } from '../../../contracts/contractsConfig'
import type { AuctionCardProps } from '../../../types/auction'

const ADMIN_ADDRESS = import.meta.env.VITE_ADMIN_ADDRESS

export function AuctionCard({ auction }: AuctionCardProps) {
  const [isBidOpen, setIsBidOpen] = useState(false)
  const [claimedLocal, setClaimedLocal] = useState(false)
  const [endedLocal, setEndedLocal] = useState(false)
  const { address: userAddress } = useAccount()

  const isWinner =
    !!userAddress &&
    !!auction.highestBidder &&
    userAddress.toLowerCase() === auction.highestBidder.toLowerCase()

  const isAdmin =
    !!userAddress && userAddress.toLowerCase() === ADMIN_ADDRESS.toLowerCase()

  const { data: auctionStruct } = useReadContract({
    address: contractsConfig.DnAAuctionHouse.address,
    abi: contractsConfig.DnAAuctionHouse.abi,
    functionName: 'auctions',
    args: [BigInt(auction.id)],
  })

  const a = auctionStruct as unknown[] | undefined
  const nftAddress = a?.[0] as string | undefined
  const tokenId = a?.[1] as bigint | undefined
  const endTime = a?.[3] as bigint | undefined
  const auctionActive = (a?.[4] as boolean) ?? true

  const { data: ownerOnChain } = useReadContract({
    address: nftAddress as `0x${string}` | undefined,
    abi: contractsConfig.DnANFT.abi,
    functionName: 'ownerOf',
    args: tokenId ? [tokenId] : undefined,
    query: { enabled: !!nftAddress && !!tokenId },
  })

  const ownerString = ownerOnChain as string | undefined
  const nftClaimed =
    !!ownerString &&
    ownerString.toLowerCase() !==
      contractsConfig.DnAAuctionHouse.address.toLowerCase()

  const auctionExpiredByTime =
    (endTime ? Number(endTime) * 1000 : 0) <= Date.now()

  const shouldShowEndButton =
    isAdmin && !endedLocal && auctionActive && auctionExpiredByTime

  const shouldShowClaimButton =
    isWinner && !claimedLocal && !auctionActive && !nftClaimed

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

        {auctionExpiredByTime && auction.highestBidder && (
          <p className={styles.winner}>
            <span>Winner: </span> {auction.highestBidder.slice(0, 6)}...
            {auction.highestBidder.slice(-4)}
          </p>
        )}

        <div className={styles.info}>
          <p className={styles.bid}>
            <span>
              {auctionExpiredByTime ? 'Winning bid:' : 'Current bid:'}
            </span>{' '}
            {auction.currentBid}
          </p>
          <p className={styles.timer}>
            <span>Ends in:</span> {auction.endsIn}
          </p>
        </div>

        {auction.endTime * 1000 > Date.now() && (
          <button className={styles.button} onClick={() => setIsBidOpen(true)}>
            Place a Bid
          </button>
        )}

        {shouldShowEndButton && (
          <EndAuctionButton
            auctionId={auction.id}
            onEnded={() => setEndedLocal(true)}
          />
        )}

        {shouldShowClaimButton && (
          <ClaimButton
            auctionId={auction.id}
            onClaimed={() => setClaimedLocal(true)}
          />
        )}

        {!isWinner && !isAdmin && !auctionActive && auctionExpiredByTime && (
          <WithdrawButton
            auctionId={auction.id}
            userAddress={userAddress}
            onWithdrawn={() =>
              console.log(`Refund claimed for auction ${auction.id}`)
            }
          />
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
