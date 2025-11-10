import { useState } from 'react'
import { useWriteContract } from 'wagmi'
import { useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { waitForTransactionReceipt } from '@wagmi/core'
import { contractsConfig } from '../../../contracts/contractsConfig'
import { wagmiConfig } from '../../../wagmiConfig'
import type { EndAuctionButtonProps } from '../../../types/auction'
import styles from './EndAuctionButton.module.css'

export function EndAuctionButton({
  auctionId,
  onEnded,
}: EndAuctionButtonProps) {
  const { writeContractAsync } = useWriteContract()
  const queryClient = useQueryClient()
  const [isEnding, setIsEnding] = useState(false)
  const [hasEnded, setHasEnded] = useState(false)

  const { address: contractAddress, abi } = contractsConfig.DnAAuctionHouse

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

      await queryClient.invalidateQueries()

      toast.success(`Auction #${auctionId} ended`, { id: 'endTx' })
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
