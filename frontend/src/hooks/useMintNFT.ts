import { usePublicClient, useWriteContract } from 'wagmi'
import { parseEther } from 'viem'
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

    const priceHash = await writeContractAsync({
      address: contractAddress,
      abi,
      functionName: 'setTokenPrice',
      args: [tokenId, parsedPrice],
    })

    await publicClient.waitForTransactionReceipt({ hash: priceHash })

    if (refetchNFTs) refetchNFTs()
    return mintHash
  }

  return { mintNFT }
}
