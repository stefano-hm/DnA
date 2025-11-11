import { useState } from 'react'
import { usePlaceBid } from '../../../hooks/usePlaceBid'
import type { BidFormProps } from '../../../types/auction'
import styles from './BidForm.module.css'

export function BidForm({
  auctionId,
  startingBid,
  highestBid,
  endTime,
  onClose,
}: BidFormProps) {
  const [amount, setAmount] = useState('')
  const { placeBid } = usePlaceBid()

  const now = Math.floor(Date.now() / 1000)
  const isExpired = endTime <= now
  const minBid = Math.max(Number(startingBid), Number(highestBid))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await placeBid(auctionId, amount, startingBid, highestBid, endTime, () => {
      setAmount('')
      onClose()
    })
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label className={styles.label}>
        Amount (ETH)
        <input
          type="number"
          step="0.0001"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className={styles.input}
          placeholder={`${(minBid + 0.0001).toFixed(4)} or higher`}
          disabled={isExpired}
        />
      </label>

      <button type="submit" className={styles.button} disabled={isExpired}>
        {isExpired ? 'Auction Ended' : 'Place Bid'}
      </button>
    </form>
  )
}
