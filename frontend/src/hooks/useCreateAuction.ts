import toast from 'react-hot-toast'
import { useWriteContract } from 'wagmi'
import { waitForTransactionReceipt } from '@wagmi/core'
import { contractsConfig } from '../contracts/contractsConfig'
import { wagmiConfig } from '../wagmiConfig'

export function useCreateAuction() {
  const { writeContractAsync } = useWriteContract()
  const { address: contractAddress, abi } = contractsConfig.DnAAuctionHouse

  const createAuction = async (
    nftAddress: string,
    tokenId: string,
    startingBid: string,
    duration: string,
    onSuccess?: () => void
  ) => {
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

      onSuccess?.()
      return hash
    } catch (error: any) {
      console.error(error)
      const raw = error?.message || ''
      let msg = 'Failed to create auction'
      if (raw.includes('ACTION_REJECTED')) msg = 'Transaction rejected by user.'
      else if (raw.includes('execution reverted'))
        msg = 'Auction creation reverted by the contract.'
      else if (raw.includes('insufficient funds'))
        msg = 'Insufficient funds for gas or transaction.'
      else if (raw.includes('timeout') || raw.includes('network error'))
        msg = 'Network issue or RPC timeout.'

      toast.error(msg, { id: 'auctionTx' })
      return null
    }
  }

  return { createAuction }
}
