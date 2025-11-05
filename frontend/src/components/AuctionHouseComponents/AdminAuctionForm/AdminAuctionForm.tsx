import { useState } from 'react'
import { useWriteContract } from 'wagmi'
import { waitForTransactionReceipt } from '@wagmi/core'
import toast from 'react-hot-toast'
import { contractsConfig } from '../../../contracts/contractsConfig'
import { wagmiConfig } from '../../../wagmiConfig'
import styles from './AdminAuctionForm.module.css'

export function AdminAuctionForm() {
  const { writeContractAsync } = useWriteContract()
  const { address: contractAddress, abi } = contractsConfig.DnAAuctionHouse

  const [formData, setFormData] = useState({
    nftAddress: '',
    tokenId: '',
    startingBid: '',
    duration: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { nftAddress, tokenId, startingBid, duration } = formData

    if (!nftAddress || !tokenId || !startingBid || !duration)
      return toast.error('Please fill in all fields')

    try {
      const hash = await writeContractAsync({
        address: contractAddress,
        abi,
        functionName: 'startAuction',
        args: [
          nftAddress,
          BigInt(tokenId),
          BigInt(Math.floor(Number(startingBid) * 1e18)),
          BigInt(duration),
        ],
      })

      toast.loading('Creating auction...', { id: 'auctionTx' })

      await waitForTransactionReceipt(wagmiConfig, { hash })

      toast.success('Auction created successfully!', { id: 'auctionTx' })
      setFormData({
        nftAddress: '',
        tokenId: '',
        startingBid: '',
        duration: '',
      })
    } catch (error: any) {
      console.error(error)
      toast.error(error?.message || 'Failed to create auction')
    }
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
