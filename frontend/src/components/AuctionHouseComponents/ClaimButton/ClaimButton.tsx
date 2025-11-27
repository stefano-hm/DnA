import { useState } from 'react'
import { useReadContract } from 'wagmi'
import { contractsConfig } from '../../../contracts/contractsConfig'
import { useClaimNFT } from '../../../hooks/useClaimNFT'
import type { ClaimButtonProps, AuctionStruct } from '../../../types/auction'
import styles from './ClaimButton.module.css'

export function ClaimButton({ auctionId, onClaimed }: ClaimButtonProps) {
  const { address: auctionAddress, abi } = contractsConfig.DnAAuctionHouse
  const [isClaiming, setIsClaiming] = useState(false)
  const [isClaimed, setIsClaimed] = useState(false)

  const { claimNFT } = useClaimNFT(id => {
    setIsClaimed(true)
    onClaimed?.(id)
  })

  const { data: auctionData } = useReadContract({
    address: auctionAddress,
    abi,
    functionName: 'auctions',
    args: [BigInt(auctionId)],
  })

  const a = auctionData as AuctionStruct | undefined

  const handleClaim = async () => {
    setIsClaiming(true)
    await claimNFT(auctionId, a)
    setIsClaiming(false)
  }

  if (isClaimed) return null

  return (
    <button
      onClick={handleClaim}
      className={styles.claimButton}
      disabled={isClaiming}
    >
      {isClaiming ? 'Claiming...' : 'Claim NFT'}
    </button>
  )
}
