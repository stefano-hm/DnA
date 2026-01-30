import { usePublicClient, useWriteContract } from 'wagmi'
import toast from 'react-hot-toast'
import { parseEther } from 'viem'
import { contractsConfig } from '../contracts/contractsConfig'

export function useSetTokenPrice(refetch?: () => void) {
  const { address: contractAddress, abi } = contractsConfig.DnANFT
  const publicClient = usePublicClient()!
  const { writeContractAsync } = useWriteContract()

  const setTokenPrice = async (tokenId: number, priceEth: string) => {
    try {
      const normalized = priceEth.replace(',', '.')
      const priceWei = parseEther(normalized)

      toast.loading('Setting price...', { id: 'price' })

      const txHash = await writeContractAsync({
        address: contractAddress,
        abi,
        functionName: 'setTokenPrice',
        args: [BigInt(tokenId), priceWei],
      })

      toast.loading('Waiting for confirmation...', { id: 'price' })
      await publicClient.waitForTransactionReceipt({ hash: txHash })

      toast.success('Price updated!', { id: 'price' })
      refetch?.()
      return txHash
    } catch (err) {
      console.error('setTokenPrice error:', err)
      toast.error('Transaction failed', { id: 'price' })
      return null
    }
  }

  const unlist = async (tokenId: number) => {
    try {
      toast.loading('Removing from sale...', { id: 'price' })

      const txHash = await writeContractAsync({
        address: contractAddress,
        abi,
        functionName: 'setTokenPrice',
        args: [BigInt(tokenId), 0n],
      })

      toast.loading('Waiting for confirmation...', { id: 'price' })
      await publicClient.waitForTransactionReceipt({ hash: txHash })

      toast.success('Removed from sale', { id: 'price' })
      refetch?.()
      return txHash
    } catch (err) {
      console.error('unlist error:', err)
      toast.error('Transaction failed', { id: 'price' })
      return null
    }
  }

  return { setTokenPrice, unlist }
}
