import { useState } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import styles from './AuctionCard.module.css'
import { Modal } from '../Modal/Modal'
import { BidForm } from '../BidForm/BidForm'
import { EndAuctionButton } from '../EndAuctionButton/EndAuctionButton'
import { ClaimButton } from '../ClaimButton/ClaimButton'
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

  const { data: onchainAuction } = useReadContract({
    address: contractsConfig.DnAAuctionHouse.address,
    abi: contractsConfig.DnAAuctionHouse.abi,
    functionName: 'auctions',
    args: [BigInt(auction.id)],
  })

  const auctionStruct = onchainAuction as
    | {
        nft: string
        tokenId: bigint
        startingBid: bigint
        endTime: bigint
        active: boolean
        highestBidder: string
        highestBid: bigint
      }
    | undefined

  const nftAddress = auctionStruct?.nft
  const tokenId = auctionStruct?.tokenId
  const activeOnChain = auctionStruct?.active ?? false

  const { data: ownerOnChain } = useReadContract({
    address: nftAddress as `0x${string}` | undefined,
    abi: contractsConfig.DnANFT.abi,
    functionName: 'ownerOf',
    args: tokenId ? [tokenId] : undefined,
    query: {
      enabled: !!nftAddress && !!tokenId,
    },
  })

  const ownerString = ownerOnChain as string | undefined

  const alreadyClaimedOnChain =
    !!ownerString &&
    ownerString.toLowerCase() !==
      contractsConfig.DnAAuctionHouse.address.toLowerCase()

  const shouldShowClaimButton =
    isWinner &&
    auction.endsIn === 'Ended' &&
    !claimedLocal &&
    !alreadyClaimedOnChain

  const shouldShowEndButton =
    isAdmin && auction.endsIn === 'Ended' && !endedLocal && activeOnChain

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
