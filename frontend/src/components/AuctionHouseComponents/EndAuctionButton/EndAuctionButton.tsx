import { useState } from 'react'
import { useWriteContract } from 'wagmi'
import toast from 'react-hot-toast'
import { contractsConfig } from '../../../contracts/contractsConfig'
import { waitForTransactionReceipt } from '@wagmi/core'
import { wagmiConfig } from '../../../wagmiConfig'
import type { EndAuctionButtonProps } from '../../../types/auction'
import styles from './EndAuctionButton.module.css'

export function EndAuctionButton({
  auctionId,
  onEnded,
}: EndAuctionButtonProps) {
  const { writeContractAsync } = useWriteContract()
  const { address: contractAddress, abi } = contractsConfig.DnAAuctionHouse
  const [isEnding, setIsEnding] = useState(false)
  const [hasEnded, setHasEnded] = useState(false)

  const handleEnd = async () => {
    try {
      setIsEnding(true)
      toast.loading(`Ending auction #${auctionId}...`, { id: 'endTx' })

      const hash = await writeContractAsync({
        address: contractAddress,
        abi,
        functionName: 'endAuction',
        args: [BigInt(auctionId)],
      })

      await waitForTransactionReceipt(wagmiConfig, { hash })

      toast.success(`Auction #${auctionId} successfully ended!`, {
        id: 'endTx',
      })
      setHasEnded(true)
      onEnded?.(auctionId)
    } catch (err: any) {
      toast.error(err?.message || 'Failed to end auction', { id: 'endTx' })
    } finally {
      setIsEnding(false)
    }
  }

  if (hasEnded) return null

  return (
    <button onClick={handleEnd} className={styles.button} disabled={isEnding}>
      {isEnding ? 'Ending...' : 'End Auction'}
    </button>
  )
}
