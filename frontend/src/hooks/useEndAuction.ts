import { useWriteContract, usePublicClient } from 'wagmi'
import toast from 'react-hot-toast'
import { contractsConfig } from '../contracts/contractsConfig'

export function useEndAuction(onEnded?: (id: number) => void) {
  const { address: auctionAddress, abi } = contractsConfig.DnAAuctionHouse
  const { writeContractAsync } = useWriteContract()
  const publicClient = usePublicClient()!

  const endAuction = async (auctionId: number) => {
    try {
      toast.loading(`Ending auction #${auctionId}...`, { id: 'endTx' })

      const txHash = await writeContractAsync({
        address: auctionAddress,
        abi,
        functionName: 'endAuction',
        args: [BigInt(auctionId)],
      })

      toast.loading('Waiting for confirmation...', { id: 'endTx' })
      await publicClient.waitForTransactionReceipt({ hash: txHash })

      toast.success(`Auction #${auctionId} successfully ended!`, {
        id: 'endTx',
      })
      onEnded?.(auctionId)
      return txHash
    } catch (err: any) {
      console.error(err)

      const raw = err?.message || ''
      let msg = 'Failed to end auction.'

      if (raw.includes('ACTION_REJECTED')) msg = 'Transaction rejected by user.'
      else if (raw.includes('Auction not ended yet'))
        msg = 'Too early: the auction is not ended yet.'
      else if (raw.includes('Auction not active'))
        msg = 'This auction is already closed.'
      else if (raw.includes('insufficient funds'))
        msg = 'Insufficient funds for gas.'
      else if (raw.includes('timeout') || raw.includes('network error'))
        msg = 'Network issue or RPC timeout.'
      else if (raw.includes('execution reverted'))
        msg = 'End reverted by the contract.'

      toast.error(msg, { id: 'endTx' })
      return null
    }
  }

  return { endAuction }
}
