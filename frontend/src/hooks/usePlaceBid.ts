import toast from 'react-hot-toast'
import { useWriteContract } from 'wagmi'
import { waitForTransactionReceipt } from '@wagmi/core'
import { parseEther } from 'viem'
import { contractsConfig } from '../contracts/contractsConfig'
import { wagmiConfig } from '../wagmiConfig'

export function usePlaceBid() {
  const { writeContractAsync } = useWriteContract()
  const { address: contractAddress, abi } = contractsConfig.DnAAuctionHouse

  const placeBid = async (
    auctionId: number,
    amount: string,
    startingBid: string,
    highestBid: string,
    endTime: number,
    onSuccess?: () => void
  ) => {
    const now = Math.floor(Date.now() / 1000)

    const normalizedAmount = amount.replace(',', '.')
    const normalizedStarting = String(startingBid).replace(',', '.')
    const normalizedHighest = String(highestBid).replace(',', '.')

    const bidValue = Number(normalizedAmount)
    const minRequired = Math.max(
      Number(normalizedStarting),
      Number(normalizedHighest)
    )

    if (endTime <= now) {
      toast.error('This auction has already ended')
      return null
    }

    if (!normalizedAmount || Number.isNaN(bidValue)) {
      toast.error('Enter a valid amount')
      return null
    }

    if (bidValue <= minRequired) {
      toast.error(`Bid must be higher than ${minRequired.toFixed(4)} ETH`)
      return null
    }

    let valueWei: bigint
    try {
      valueWei = parseEther(normalizedAmount)
    } catch {
      toast.error('Invalid bid format')
      return null
    }

    try {
      toast.loading('Submitting bid...', { id: 'bidTx' })

      const hash = await writeContractAsync({
        address: contractAddress,
        abi,
        functionName: 'bid',
        args: [BigInt(auctionId)],
        value: valueWei,
      })

      await waitForTransactionReceipt(wagmiConfig, { hash })

      toast.success('Bid placed successfully!', { id: 'bidTx' })
      onSuccess?.()
      return hash
    } catch (err: any) {
      console.error(err)

      const raw = err?.message || ''
      let msg = 'Bid failed'

      if (raw.includes('ACTION_REJECTED')) msg = 'Transaction rejected by user.'
      else if (raw.includes('Bid too low'))
        msg = 'Bid too low. Increase your bid.'
      else if (raw.includes('Auction ended'))
        msg = 'This auction has already ended.'
      else if (raw.includes('Auction not active'))
        msg = 'This auction is not active.'
      else if (raw.includes('insufficient funds'))
        msg = 'Insufficient funds for gas or bid.'
      else if (raw.includes('timeout') || raw.includes('network error'))
        msg = 'Network issue or RPC timeout.'
      else if (raw.includes('execution reverted'))
        msg = 'Bid rejected by contract rules.'

      toast.error(msg, { id: 'bidTx' })
      return null
    }
  }

  return { placeBid }
}
