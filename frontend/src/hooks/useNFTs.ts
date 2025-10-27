import { useEffect, useState } from 'react'
import { useReadContract, useWatchContractEvent } from 'wagmi'
import { contractsConfig } from '../contracts/contractsConfig'
import type { NFTItem } from '../types/nft'

export function useNFTs() {
  const { address: contractAddress, abi } = contractsConfig.DnANFT
  const [nfts, setNfts] = useState<NFTItem[]>([])

  const { data, isLoading, error, refetch } = useReadContract({
    address: contractAddress,
    abi,
    functionName: 'getAllNFTs',
  })

  useEffect(() => {
    if (!data || !Array.isArray(data)) return

    const [ids, owners, uris, prices] = data as [
      bigint[],
      string[],
      string[],
      bigint[],
    ]

    const formatted = ids.map((id, i) => ({
      tokenId: Number(id),
      image: uris[i].startsWith('ipfs://')
        ? uris[i].replace('ipfs://', 'https://ipfs.io/ipfs/')
        : uris[i],
      owner: owners[i],
      price: (Number(prices[i]) / 1e18).toFixed(3),
    }))

    setNfts(formatted)
  }, [data])

  useWatchContractEvent({
    address: contractAddress,
    abi,
    eventName: 'Minted',
    onLogs: () => refetch(),
  })

  return { nfts, isLoading, error, refetch }
}
