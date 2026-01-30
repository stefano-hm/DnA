import { usePublicClient, useWriteContract } from 'wagmi'
import { parseEther, decodeEventLog } from 'viem'
import { contractsConfig } from '../contracts/contractsConfig'

export function useMintNFT() {
  const { address: contractAddress, abi } = contractsConfig.DnANFT
  const publicClient = usePublicClient()!
  const { writeContractAsync } = useWriteContract()

  const mintNFT = async (
    userAddress: string,
    metadataURI: string,
    price: string,
    refetchNFTs?: () => void
  ) => {
    const normalizedPrice = price.replace(',', '.')
    const parsedPrice = parseEther(normalizedPrice)

    const mintHash = await writeContractAsync({
      address: contractAddress,
      abi,
      functionName: 'mintTo',
      args: [userAddress, metadataURI],
    })

    const mintReceipt = await publicClient.waitForTransactionReceipt({
      hash: mintHash,
    })

    let tokenId: bigint | null = null

    for (const log of mintReceipt.logs) {
      try {
        const decoded = decodeEventLog({
          abi,
          data: log.data,
          topics: log.topics,
        })

        if (decoded.eventName === 'Minted') {
          tokenId = (decoded.args as any).tokenId as bigint
          break
        }
      } catch {
      }
    }

    if (tokenId === null) {
      throw new Error('Minted event not found in transaction receipt')
    }

    const priceHash = await writeContractAsync({
      address: contractAddress,
      abi,
      functionName: 'setTokenPrice',
      args: [tokenId, parsedPrice],
    })

    await publicClient.waitForTransactionReceipt({ hash: priceHash })

    if (refetchNFTs) refetchNFTs()

    return priceHash
  }

  return { mintNFT }
}
