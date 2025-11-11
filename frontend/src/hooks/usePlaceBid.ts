import toast from 'react-hot-toast'
import { useWriteContract } from 'wagmi'
import { waitForTransactionReceipt } from '@wagmi/core'
import { parseEther } from 'ethers'
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
    const bidValue = Number(amount)
    const minRequired = Math.max(Number(startingBid), Number(highestBid))

    if (endTime <= now) {
      toast.error('This auction has already ended')
      return
    }

    if (!amount || isNaN(bidValue)) {
      toast.error('Enter a valid amount')
      return
    }

    if (bidValue <= minRequired) {
      toast.error(`Bid must be higher than ${minRequired} ETH`)
      return
    }

    try {
      toast.dismiss('bidTx')
      toast.loading('Submitting bid...', { id: 'bidTx' })

      const hash = await writeContractAsync({
        address: contractAddress,
        abi,
        functionName: 'bid',
        args: [BigInt(auctionId)],
        value: parseEther(amount),
      })

      await waitForTransactionReceipt(wagmiConfig, { hash })

      toast.success('Bid placed successfully!', { id: 'bidTx' })
      onSuccess?.()
      return hash
    } catch (err: any) {
      console.error(err)
      toast.dismiss('bidTx')

      const raw = err?.message || ''
      let msg = 'Bid failed'
      if (raw.includes('ACTION_REJECTED')) msg = 'Transaction rejected by user.'
      else if (raw.includes('insufficient funds'))
        msg = 'Insufficient funds for gas or transaction.'
      else if (raw.includes('execution reverted'))
        msg = 'Bid rejected by contract rules.'
      else if (raw.includes('timeout') || raw.includes('network error'))
        msg = 'Network issue or RPC timeout.'

      toast.error(msg, { id: 'bidTx' })
      return null
    }
  }

  return { placeBid }
}
