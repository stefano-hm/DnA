import { useEffect, useState } from 'react'
import { useReadContract } from 'wagmi'
import { contractsConfig } from '../../../contracts/contractsConfig'
import { useEndAuction } from '../../../hooks/useEndAuction'
import type { EndAuctionButtonProps } from '../../../types/auction'
import styles from './EndAuctionButton.module.css'

export function EndAuctionButton({
  auctionId,
  onEnded,
}: EndAuctionButtonProps) {
  const { address: auctionAddress, abi } = contractsConfig.DnAAuctionHouse
  const [isEnding, setIsEnding] = useState(false)
  const [hasEnded, setHasEnded] = useState(false)

  const { endAuction } = useEndAuction(id => {
    setHasEnded(true)
    onEnded?.(id)
  })

  const { data: auctionData } = useReadContract({
    address: auctionAddress,
    abi,
    functionName: 'auctions',
    args: [BigInt(auctionId)],
  })

  const a = auctionData as unknown[] | undefined
  const active = a?.[4] as boolean | undefined

  useEffect(() => {
    if (active === false) {
      setHasEnded(true)
    }
  }, [active])

  const handleEnd = async () => {
    setIsEnding(true)
    await endAuction(auctionId)
    setIsEnding(false)
  }

  if (hasEnded) return null

  return (
    <button onClick={handleEnd} className={styles.button} disabled={isEnding}>
      {isEnding ? 'Ending...' : 'End Auction'}
    </button>
  )
}
