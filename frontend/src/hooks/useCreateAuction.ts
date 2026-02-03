import toast from 'react-hot-toast'
import { useState } from 'react'
import { useWriteContract } from 'wagmi'
import { waitForTransactionReceipt } from '@wagmi/core'
import { parseEther } from 'viem'
import { contractsConfig } from '../contracts/contractsConfig'
import { wagmiConfig } from '../wagmiConfig'

export function useCreateAuction() {
  const { writeContractAsync } = useWriteContract()
  const [isPending, setIsPending] = useState(false)

  const { address: auctionHouseAddress, abi: auctionHouseAbi } =
    contractsConfig.DnAAuctionHouse
  const { address: nftAddress, abi: nftAbi } = contractsConfig.DnANFT

  const approveAuctionHouse = async (tokenId: number) => {
    try {
      setIsPending(true)
      toast.loading('Approving AuctionHouse...', { id: 'approveTx' })

      const hash = await writeContractAsync({
        address: nftAddress,
        abi: nftAbi,
        functionName: 'approve',
        args: [auctionHouseAddress, BigInt(tokenId)],
      })

      await waitForTransactionReceipt(wagmiConfig, { hash })
      toast.success('Approved successfully!', { id: 'approveTx' })
      return hash
    } catch (error: any) {
      console.error(error)
      const raw = error?.message || ''
      let msg = 'Approval failed'
      if (raw.includes('ACTION_REJECTED')) msg = 'Transaction rejected by user.'
      else if (raw.includes('execution reverted'))
        msg = 'Approval reverted by the contract.'
      toast.error(msg, { id: 'approveTx' })
      return null
    } finally {
      setIsPending(false)
    }
  }

  const createAuction = async (
    nftAddr: string,
    tokenId: string,
    startingBid: string,
    duration: string,
    onSuccess?: () => void
  ) => {
    if (!nftAddr || !tokenId || !startingBid || !duration) {
      toast.error('Please fill in all fields')
      return null
    }

    const normalizedBid = startingBid.replace(',', '.')
    const tokenIdBn = BigInt(tokenId)
    const durationBn = BigInt(duration)

    let startingBidWei: bigint
    try {
      startingBidWei = parseEther(normalizedBid)
    } catch {
      toast.error('Invalid starting bid format')
      return null
    }

    try {
      setIsPending(true)
      toast.loading('Creating auction...', { id: 'auctionTx' })

      const hash = await writeContractAsync({
        address: auctionHouseAddress,
        abi: auctionHouseAbi,
        functionName: 'startAuction',
        args: [nftAddr, tokenIdBn, startingBidWei, durationBn],
      })

      await waitForTransactionReceipt(wagmiConfig, { hash })
      toast.success('Auction created successfully!', { id: 'auctionTx' })

      onSuccess?.()
      return hash
    } catch (error: any) {
      console.error(error)
      const raw = error?.message || ''
      let msg = 'Failed to create auction'

      if (raw.includes('ACTION_REJECTED')) msg = 'Transaction rejected by user.'
      else if (raw.includes('Not owner/approved'))
        msg = 'You are not the owner (or approved) for this token.'
      else if (raw.includes('AuctionHouse not approved'))
        msg = 'Approve the AuctionHouse for this token first.'
      else if (raw.includes('Duration too short'))
        msg = 'Duration too short (min 60 seconds).'
      else if (raw.includes('Invalid starting bid'))
        msg = 'Starting bid must be > 0.'
      else if (raw.includes('execution reverted'))
        msg = 'Auction creation reverted by the contract.'
      else if (raw.includes('insufficient funds'))
        msg = 'Insufficient funds for gas or transaction.'
      else if (raw.includes('timeout') || raw.includes('network error'))
        msg = 'Network issue or RPC timeout.'

      toast.error(msg, { id: 'auctionTx' })
      return null
    } finally {
      setIsPending(false)
    }
  }

  return { createAuction, approveAuctionHouse, isPending }
}
