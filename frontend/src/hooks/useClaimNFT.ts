import toast from 'react-hot-toast'
import { useWriteContract } from 'wagmi'
import { waitForTransactionReceipt } from '@wagmi/core'
import { contractsConfig } from '../contracts/contractsConfig'
import { wagmiConfig } from '../wagmiConfig'

export function useClaimNFT(onClaimed?: (id: number) => void) {
  const { writeContractAsync } = useWriteContract()
  const { address: auctionAddress, abi } = contractsConfig.DnAAuctionHouse

  const claimNFT = async (auctionId: number) => {
    try {
      toast.loading(`Claiming NFT from auction #${auctionId}...`, {
        id: 'claimTx',
      })

      const hash = await writeContractAsync({
        address: auctionAddress,
        abi,
        functionName: 'claim',
        args: [BigInt(auctionId)],
      })

      await waitForTransactionReceipt(wagmiConfig, { hash })

      toast.success(`NFT from auction #${auctionId} successfully claimed!`, {
        id: 'claimTx',
      })
      onClaimed?.(auctionId)
      return hash
    } catch (err: any) {
      console.error(err)

      const raw = err?.message || ''
      let msg = 'Failed to claim NFT.'

      if (raw.includes('ACTION_REJECTED')) msg = 'Transaction rejected by user.'
      else if (raw.includes('Already claimed'))
        msg = 'This auction has already been claimed.'
      else if (raw.includes('Not winner'))
        msg = 'Only the winning bidder can claim this NFT.'
      else if (raw.includes('No winner')) msg = 'No winner for this auction.'
      else if (raw.includes('Auction still active'))
        msg = 'Auction is still active.'
      else if (raw.includes('insufficient funds'))
        msg = 'Insufficient funds for gas.'
      else if (raw.includes('timeout') || raw.includes('network error'))
        msg = 'Network issue or RPC timeout.'
      else if (raw.includes('execution reverted'))
        msg = 'Claim reverted by the contract.'

      toast.error(msg, { id: 'claimTx' })
      return null
    }
  }

  return { claimNFT }
}
