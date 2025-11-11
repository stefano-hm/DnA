import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useCreateAuction } from '../../../hooks/useCreateAuction'
import type { AuctionFormData } from '../../../types/auction'
import styles from './AdminAuctionForm.module.css'

const ADMIN_ADDRESS = import.meta.env.VITE_ADMIN_ADDRESS

export function AdminAuctionForm() {
  const { address: userAddress } = useAccount()
  const { createAuction } = useCreateAuction()
  const [formData, setFormData] = useState<AuctionFormData>({
    nftAddress: '',
    tokenId: '',
    startingBid: '',
    duration: '',
  })

  const isAdmin =
    !!userAddress && userAddress.toLowerCase() === ADMIN_ADDRESS.toLowerCase()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { nftAddress, tokenId, startingBid, duration } = formData

    await createAuction(nftAddress, tokenId, startingBid, duration, () => {
      setFormData({
        nftAddress: '',
        tokenId: '',
        startingBid: '',
        duration: '',
      })
    })
  }

  if (!isAdmin) {
    return (
      <div className={styles.form}>
        <p style={{ textAlign: 'center', opacity: 0.7 }}>
          Only the admin can create new auctions.
        </p>
      </div>
    )
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.heading}>Create New Auction</h2>

      <label className={styles.label}>
        NFT Contract Address
        <input
          type="text"
          name="nftAddress"
          value={formData.nftAddress}
          onChange={handleChange}
          className={styles.input}
          placeholder="0x..."
        />
      </label>

      <label className={styles.label}>
        Token ID
        <input
          type="number"
          name="tokenId"
          value={formData.tokenId}
          onChange={handleChange}
          className={styles.input}
          placeholder="1"
        />
      </label>

      <label className={styles.label}>
        Starting Bid (ETH)
        <input
          type="number"
          step="0.001"
          name="startingBid"
          value={formData.startingBid}
          onChange={handleChange}
          className={styles.input}
          placeholder="0.05"
        />
      </label>

      <label className={styles.label}>
        Duration (seconds)
        <input
          type="number"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          className={styles.input}
          placeholder="3600"
        />
      </label>

      <button type="submit" className={styles.button}>
        Create Auction
      </button>
    </form>
  )
}
