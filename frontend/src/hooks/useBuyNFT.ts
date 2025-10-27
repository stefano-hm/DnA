import { useWriteContract, usePublicClient } from 'wagmi'
import toast from 'react-hot-toast'
import { parseEther } from 'viem'
import { contractsConfig } from '../contracts/contractsConfig'

export function useBuyNFT() {
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

      await publicClient.waitForTransactionReceipt({ hash: txHash })

      toast.success('NFT purchased successfully!', { id: 'buy' })

      if (typeof window !== 'undefined' && (window as any).refetchNFTs) {
        ;(window as any).refetchNFTs()
      }

      return txHash
    } catch (err) {
      console.error('Buy transaction error:', err)
      toast.error('Transaction failed', { id: 'buy' })
      return null
    }
  }

  return { buyNFT }
}
