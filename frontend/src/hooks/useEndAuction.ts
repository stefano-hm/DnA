import { useWriteContract, usePublicClient } from 'wagmi'
import toast from 'react-hot-toast'
import { contractsConfig } from '../contracts/contractsConfig'

export function useEndAuction(onEnded?: (id: number) => void) {
  const { address: auctionAddress, abi } = contractsConfig.DnAAuctionHouse
  const { writeContractAsync } = useWriteContract()
  const publicClient = usePublicClient()!

  const endAuction = async (auctionId: number) => {
    try {
      toast.dismiss('endTx')
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
      toast.dismiss('endTx')

      const raw = err?.message || ''
      let msg = 'Failed to end auction. Please try again.'
      if (raw.includes('ACTION_REJECTED')) msg = 'Transaction rejected by user.'
      else if (raw.includes('insufficient funds'))
        msg = 'Insufficient funds for gas or transaction.'
      else if (raw.includes('execution reverted'))
        msg = 'The auction could not be ended — possibly already closed.'
      else if (raw.includes('timeout') || raw.includes('network error'))
        msg = 'Network issue or RPC timeout.'

      toast.error(msg, { id: 'endTx' })
      return null
    }
  }

  return { endAuction }
}
