import { useMemo, useState } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { useCreateAuction } from '../../../hooks/useCreateAuction'
import type { AuctionFormData } from '../../../types/auction'
import styles from './AdminAuctionForm.module.css'
import { contractsConfig } from '../../../contracts/contractsConfig'

export function AdminAuctionForm() {
  const { address: isConnected } = useAccount()
  const { createAuction, approveAuctionHouse, isPending } = useCreateAuction()

  const { address: nftAddress } = contractsConfig.DnANFT
  const { address: auctionHouseAddress } = contractsConfig.DnAAuctionHouse

  const [formData, setFormData] = useState<AuctionFormData>({
    nftAddress: nftAddress,
    tokenId: '',
    startingBid: '',
    duration: '',
  })

  const tokenIdBig = useMemo(() => {
    const n = Number(formData.tokenId)
    return Number.isFinite(n) && n > 0 ? BigInt(n) : null
  }, [formData.tokenId])

  const { data: approvedAddress } = useReadContract({
    address: nftAddress,
    abi: contractsConfig.DnANFT.abi,
    functionName: 'getApproved',
    args: tokenIdBig ? [tokenIdBig] : undefined,
    query: { enabled: !!tokenIdBig },
  })

  const isApprovedForToken =
    typeof approvedAddress === 'string' &&
    approvedAddress.toLowerCase() === auctionHouseAddress.toLowerCase()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleApprove = async () => {
    const tokenId = Number(formData.tokenId)
    if (!isConnected) return
    if (!tokenId || tokenId <= 0) return

    await approveAuctionHouse(tokenId)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isConnected) return

    const { tokenId, startingBid, duration } = formData
    await createAuction(nftAddress, tokenId, startingBid, duration, () => {
      setFormData(prev => ({
        ...prev,
        tokenId: '',
        startingBid: '',
        duration: '',
      }))
    })
  }

  if (!isConnected) {
    return (
      <p className={styles.formHeading}>
        Connect your wallet to start an auction.
      </p>
    )
  }

  return (
    <form className={styles.adminForm} onSubmit={handleSubmit}>
      <h2 className={styles.formHeading}>Start a New Auction</h2>

      <p className={styles.formLabel}>
        NFT Contract: <span>{nftAddress}</span>
      </p>

      <label className={styles.formLabel}>
        Token ID
        <input
          type="number"
          name="tokenId"
          value={formData.tokenId}
          onChange={handleChange}
          className={styles.formInput}
          placeholder="1"
        />
      </label>

      <label className={styles.formLabel}>
        Starting Bid (ETH)
        <input
          type="number"
          step="0.001"
          name="startingBid"
          value={formData.startingBid}
          onChange={handleChange}
          className={styles.formInput}
          placeholder="0.05"
        />
      </label>

      <label className={styles.formLabel}>
        Duration (seconds)
        <input
          type="number"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          className={styles.formInput}
          placeholder="3600"
        />
      </label>

      {!isApprovedForToken && (
        <button
          type="button"
          onClick={handleApprove}
          className={styles.submitButton}
          disabled={isPending || !formData.tokenId}
        >
          Approve AuctionHouse
        </button>
      )}

      <button
        type="submit"
        className={styles.submitButton}
        disabled={
          isPending ||
          !formData.tokenId ||
          !formData.startingBid ||
          !formData.duration ||
          !isApprovedForToken
        }
      >
        Create Auction
      </button>
    </form>
  )
}
