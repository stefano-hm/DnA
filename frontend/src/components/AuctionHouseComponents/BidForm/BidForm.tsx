import { useState } from 'react'
import { useWriteContract } from 'wagmi'
import { waitForTransactionReceipt } from '@wagmi/core'
import toast from 'react-hot-toast'
import { contractsConfig } from '../../../contracts/contractsConfig'
import { wagmiConfig } from '../../../wagmiConfig'
import styles from './BidForm.module.css'

interface BidFormProps {
  auctionId: number
  startingBid: string
  highestBid: string
  endTime: number
  onClose: () => void
}

export function BidForm({
  auctionId,
  startingBid,
  highestBid,
  endTime,
  onClose,
}: BidFormProps) {
  const [amount, setAmount] = useState('')
  const { writeContractAsync } = useWriteContract()
  const { address: contractAddress, abi } = contractsConfig.DnAAuctionHouse

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const now = Math.floor(Date.now() / 1000)
    const bidValue = Number(amount)
    const minRequired = Math.max(Number(startingBid), Number(highestBid))

    if (endTime <= now) {
      toast.error('This auction has already ended')
      return
    }

    if (!bidValue || bidValue <= minRequired) {
      toast.error(`Bid must be higher than ${minRequired} ETH`)
      return
    }

    try {
      toast.loading('Submitting bid...', { id: 'bidTx' })

      const hash = await writeContractAsync({
        address: contractAddress,
        abi,
        functionName: 'bid',
        args: [BigInt(auctionId)],
        value: BigInt(Math.floor(bidValue * 1e18)),
      })

      await waitForTransactionReceipt(wagmiConfig, { hash })
      toast.success('Bid placed successfully!', { id: 'bidTx' })
      setAmount('')
      onClose()
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message || 'Bid failed', { id: 'bidTx' })
    }
  }

  const now = Math.floor(Date.now() / 1000)
  const isExpired = endTime <= now
  const minBid = Math.max(Number(startingBid), Number(highestBid))

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label className={styles.label}>
        Amount (ETH)
        <input
          type="number"
          step="0.001"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className={styles.input}
          placeholder={`${minBid + 0.001} or higher`}
          disabled={isExpired}
        />
      </label>

      <button type="submit" className={styles.button} disabled={isExpired}>
        {isExpired ? 'Auction Ended' : 'Place Bid'}
      </button>
    </form>
  )
}
