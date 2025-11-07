import { useState } from 'react'
import { useWriteContract } from 'wagmi'
import toast from 'react-hot-toast'
import { contractsConfig } from '../../../contracts/contractsConfig'
import { waitForTransactionReceipt } from '@wagmi/core'
import { wagmiConfig } from '../../../wagmiConfig'
import type { ClaimButtonProps } from '../../../types/auction'
import styles from './ClaimButton.module.css'

export function ClaimButton({ auctionId, onClaimed }: ClaimButtonProps) {
  const { writeContractAsync } = useWriteContract()
  const { address: contractAddress, abi } = contractsConfig.DnAAuctionHouse
  const [isClaiming, setIsClaiming] = useState(false)
  const [isClaimed, setIsClaimed] = useState(false)

  const handleClaim = async () => {
    try {
      setIsClaiming(true)
      toast.loading(`Claiming NFT from auction #${auctionId}...`, {
        id: 'claimTx',
      })

      const hash = await writeContractAsync({
        address: contractAddress,
        abi,
        functionName: 'claim',
        args: [BigInt(auctionId)],
      })

      await waitForTransactionReceipt(wagmiConfig, { hash })

      toast.success(`NFT from auction #${auctionId} successfully claimed!`, {
        id: 'claimTx',
      })

      setIsClaimed(true)
      onClaimed?.(auctionId)
    } catch (err: any) {
      toast.error(err?.message || 'Failed to claim NFT', { id: 'claimTx' })
    } finally {
      setIsClaiming(false)
    }
  }

  if (isClaimed) return null

  return (
    <button
      onClick={handleClaim}
      className={styles.button}
      disabled={isClaiming}
    >
      {isClaiming ? 'Claiming...' : 'Claim NFT'}
    </button>
  )
}
