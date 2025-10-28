import { useWriteContract, usePublicClient, useWatchContractEvent } from 'wagmi'
import toast from 'react-hot-toast'
import { parseEther } from 'viem'
import { contractsConfig } from '../contracts/contractsConfig'

export function useBuyNFT(refetch?: () => void) {
  const { address: contractAddress, abi } = contractsConfig.DnANFT
  const publicClient = usePublicClient()!
  const { writeContractAsync } = useWriteContract()

  const buyNFT = async (tokenId: number, price: string) => {
    try {
      toast.loading('Processing purchase...', { id: 'buy' })

      const txHash = await writeContractAsync({
        address: contractAddress,
        abi,
        functionName: 'buy',
        args: [BigInt(tokenId)],
        value: parseEther(price),
      })

      toast.loading('Waiting for confirmation...', { id: 'buy' })
      await publicClient.waitForTransactionReceipt({ hash: txHash })

      toast.success('NFT purchased successfully!', { id: 'buy' })
      return txHash
    } catch (err) {
      console.error('Buy transaction error:', err)
      toast.error('Transaction failed', { id: 'buy' })
      return null
    }
  }

  useWatchContractEvent({
    address: contractAddress,
    abi,
    eventName: 'Purchased',
    onLogs: logs => {
      console.log('Purchased event detected:', logs)
      if (refetch) refetch()
    },
  })

  return { buyNFT }
}
