import { useEffect, useMemo, useState } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { useCreateAuction } from '../../../hooks/useCreateAuction'
import type { AuctionFormData } from '../../../types/auction'
import styles from './AdminAuctionForm.module.css'
import { contractsConfig } from '../../../contracts/contractsConfig'

export function AdminAuctionForm() {
  const { address: userAddress, isConnected } = useAccount()
  const { createAuction, approveAuctionHouse, isPending } = useCreateAuction()

  const { address: nftAddress } = contractsConfig.DnANFT
  const { address: auctionHouseAddress } = contractsConfig.DnAAuctionHouse

  const [formData, setFormData] = useState<AuctionFormData>({
    nftAddress,
    tokenId: '',
    startingBid: '',
    duration: '',
  })

  const { data: ownedData } = useReadContract({
    address: nftAddress,
    abi: contractsConfig.DnANFT.abi,
    functionName: 'getOwnedNFTs',
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!userAddress },
  })

  const ownedIds = useMemo(() => {
    if (!ownedData) return []
    const [ids] = ownedData as [bigint[], string[], bigint[]]
    return (ids ?? [])
      .map(x => Number(x))
      .filter(n => Number.isFinite(n) && n > 0)
  }, [ownedData])

  const hasAnyNFT = ownedIds.length > 0

  const tokenIdBig = useMemo(() => {
    const n = Number(formData.tokenId)
    return Number.isFinite(n) && n > 0 ? BigInt(n) : null
  }, [formData.tokenId])

  const {
    data: approvedAddress,
    refetch: refetchApproved,
    isFetching: isFetchingApproved,
  } = useReadContract({
    address: nftAddress,
    abi: contractsConfig.DnANFT.abi,
    functionName: 'getApproved',
    args: tokenIdBig ? [tokenIdBig] : undefined,
    query: { enabled: !!tokenIdBig },
  })

  const isApprovedForToken =
    typeof approvedAddress === 'string' &&
    approvedAddress.toLowerCase() === auctionHouseAddress.toLowerCase()

  const showCreateFields = !!tokenIdBig && isApprovedForToken

  useEffect(() => {
    if (tokenIdBig) refetchApproved()
  }, [tokenIdBig, refetchApproved])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleApprove = async () => {
    const tokenId = Number(formData.tokenId)
    if (!isConnected) return
    if (!tokenId || tokenId <= 0) return

    const hash = await approveAuctionHouse(tokenId)

    if (hash) {
      await refetchApproved()
    }
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

  if (!hasAnyNFT) {
    return (
      <p className={styles.formHeading}>
        You do not own any NFTs yet. Buy one in the Store to start an auction.
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
        Token ID (you own: {ownedIds.join(', ')})
        <input
          type="number"
          name="tokenId"
          value={formData.tokenId}
          onChange={handleChange}
          className={styles.formInput}
          placeholder={ownedIds[0] ? String(ownedIds[0]) : '1'}
        />
      </label>

      {!showCreateFields && (
        <button
          type="button"
          onClick={handleApprove}
          className={styles.submitButton}
          disabled={
            isPending || isFetchingApproved || !formData.tokenId || !tokenIdBig
          }
        >
          {isFetchingApproved ? 'Checking approval...' : 'Approve AuctionHouse'}
        </button>
      )}

      {showCreateFields && (
        <>
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

          <button
            type="submit"
            className={styles.submitButton}
            disabled={
              isPending ||
              !formData.startingBid ||
              !formData.duration ||
              !isApprovedForToken
            }
          >
            Create Auction
          </button>
        </>
      )}
    </form>
  )
}
