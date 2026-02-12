import { useEffect, useMemo, useState } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import styles from './AuctionCard.module.css'
import { Modal } from '../Modal/Modal'
import { BidForm } from '../BidForm/BidForm'
import { EndAuctionButton } from '../EndAuctionButton/EndAuctionButton'
import { ClaimButton } from '../ClaimButton/ClaimButton'
import { WithdrawButton } from '../WithdrawButton/WithdrawButton'
import { ViewDetailsButton } from '../../Shared/ViewDetailsButton/ViewDetailsButton'
import { contractsConfig } from '../../../contracts/contractsConfig'
import type { AuctionCardProps } from '../../../types/auction'

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

function formatEndsInLive(endTimeSec: number, nowMs: number): string {
  const nowSec = Math.floor(nowMs / 1000)
  const diff = endTimeSec - nowSec
  if (diff <= 0) return 'Ended'
  const hours = Math.floor(diff / 3600)
  const minutes = Math.floor((diff % 3600) / 60)
  const seconds = diff % 60
  return `${hours}h ${minutes}m ${seconds}s`
}

export function AuctionCard({ auction }: AuctionCardProps) {
  const [isBidOpen, setIsBidOpen] = useState(false)
  const [claimedLocal, setClaimedLocal] = useState(false)
  const [endedLocal, setEndedLocal] = useState(false)

  const [nowMs, setNowMs] = useState(Date.now())
  useEffect(() => {
    if (!auctionActive) return
    const t = setInterval(() => setNowMs(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const { address: userAddress } = useAccount()

  const normalizedUser = userAddress?.toLowerCase()
  const isSeller =
    !!normalizedUser && normalizedUser === auction.seller.toLowerCase()

  const isWinner =
    !!userAddress &&
    !!auction.highestBidder &&
    auction.highestBidder.toLowerCase() !== ZERO_ADDRESS &&
    userAddress.toLowerCase() === auction.highestBidder.toLowerCase()

  const { data: auctionStruct } = useReadContract({
    address: contractsConfig.DnAAuctionHouse.address,
    abi: contractsConfig.DnAAuctionHouse.abi,
    functionName: 'auctions',
    args: [BigInt(auction.id)],
  })

  const a = auctionStruct as unknown[] | undefined

  const tokenId = a?.[1] as bigint | undefined
  const endTimeOnChain = a?.[4] as bigint | undefined
  const auctionActive = (a?.[5] as boolean) ?? auction.active
  const claimedOnChain = (a?.[6] as boolean) ?? auction.claimed
  const highestBidderOnChain = (a?.[7] as string) ?? auction.highestBidder

  const hasWinnerOnChain =
    typeof highestBidderOnChain === 'string' &&
    highestBidderOnChain.toLowerCase() !== ZERO_ADDRESS

  const isClaimed = claimedLocal || claimedOnChain

  const endTimeSec = useMemo(() => {
    if (endTimeOnChain) return Number(endTimeOnChain)
    return auction.endTime
  }, [endTimeOnChain, auction.endTime])

  const endsInText = useMemo(
    () => formatEndsInLive(endTimeSec, nowMs),
    [endTimeSec, nowMs]
  )

  const auctionExpiredByTime = endTimeSec * 1000 <= nowMs

  const shouldShowEndButton =
    !endedLocal &&
    auctionActive &&
    auctionExpiredByTime &&
    (isSeller || isWinner)

  const shouldShowClaimButton =
    isWinner && !auctionActive && hasWinnerOnChain && !isClaimed

  const canBid = auctionActive && !auctionExpiredByTime
  const showWinnerText = !auctionActive && hasWinnerOnChain
  const isNoBidEnded = !auctionActive && !hasWinnerOnChain

  const bidLabel = !auctionActive ? 'Winning bid:' : 'Current bid:'
  const bidValueText = `${auction.highestBid} ETH`

  return (
    <div className={styles.auctionCard}>
      <img
        src={auction.image}
        alt={auction.title}
        className={styles.auctionImage}
        loading="lazy"
      />

      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{auction.title}</h3>

        {showWinnerText && (
          <p className={styles.winnerText}>
            <span>Winner: </span> {highestBidderOnChain.slice(0, 6)}...
            {highestBidderOnChain.slice(-4)}
          </p>
        )}

        {isNoBidEnded && (
          <p className={styles.winnerText}>
            <span>Status: </span> No bids (NFT returned)
          </p>
        )}

        <div className={styles.infoRow}>
          <p className={styles.bidText}>
            <span>{bidLabel}</span> {bidValueText}
          </p>

          <p className={styles.timerText}>
            <span>Ends in:</span> {endsInText}
          </p>
        </div>

        {typeof tokenId === 'bigint' && (
          <ViewDetailsButton tokenId={Number(tokenId)} />
        )}

        {canBid && (
          <button
            className={styles.bidButton}
            onClick={() => setIsBidOpen(true)}
          >
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

        {userAddress && (
          <WithdrawButton
            auctionId={auction.id}
            userAddress={userAddress}
            onWithdrawn={() =>
              console.log(`Refund claimed for auction ${auction.id}`)
            }
          />
        )}

        {isWinner && !auctionActive && hasWinnerOnChain && isClaimed && (
          <p className={styles.winnerText}>
            <span>Status: </span> Claimed
          </p>
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
          endTime={endTimeSec}
          onClose={() => setIsBidOpen(false)}
        />
      </Modal>
    </div>
  )
}
