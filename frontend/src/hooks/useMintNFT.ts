import { usePublicClient, useWriteContract } from 'wagmi'
import { parseEther } from 'viem'
import toast from 'react-hot-toast'
import { contractsConfig } from '../contracts/contractsConfig'

export function useMintNFT() {
  const { address: contractAddress, abi } = contractsConfig.DnANFT
  const publicClient = usePublicClient()!
  const { writeContractAsync } = useWriteContract()

  const mintNFT = async (
    userAddress: string,
    title: string,
    price: string,
    refetchNFTs?: () => void
  ) => {
    try {
      const uri = `ipfs://your-metadata-link-for-${title
        .replace(/\s+/g, '-')
        .toLowerCase()}`
      const normalizedPrice = price.replace(',', '.')
      const parsedPrice = parseEther(normalizedPrice)

      toast.loading('Minting NFT...', { id: 'mint' })
      const mintHash = await writeContractAsync({
        address: contractAddress,
        abi,
        functionName: 'mintTo',
        args: [userAddress, uri],
      })

      const mintReceipt = await publicClient.waitForTransactionReceipt({
        hash: mintHash,
      })
      toast.success('NFT minted successfully!', { id: 'mint' })

      const transferLog = mintReceipt.logs.find(
        (l: any) =>
          Array.isArray(l.topics) &&
          l.topics.length > 3 &&
          typeof l.topics[0] === 'string' &&
          l.topics[0].includes('ddf252ad')
      )

      const tokenId = transferLog?.topics?.[3]
        ? BigInt(transferLog.topics[3] as string)
        : 1n

      toast.loading('Setting token price...', { id: 'price' })
      const priceHash = await writeContractAsync({
        address: contractAddress,
        abi,
        functionName: 'setTokenPrice',
        args: [tokenId, parsedPrice],
      })

      await publicClient.waitForTransactionReceipt({ hash: priceHash })
      toast.success('Price set successfully!', { id: 'price' })

      if (refetchNFTs) refetchNFTs()
      return mintHash
    } catch (err) {
      console.error('Mint error:', err)
      toast.error('Mint failed', { id: 'mint' })
      return null
    }
  }

  return { mintNFT }
}
