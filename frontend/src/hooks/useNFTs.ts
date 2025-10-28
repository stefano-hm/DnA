import { useEffect, useState } from 'react'
import { useReadContract, useWatchContractEvent } from 'wagmi'
import { contractsConfig } from '../contracts/contractsConfig'
import type { NFTItem } from '../types/nft'
import { ipfsToHttp } from '../services/ipfsService'

export function useNFTs() {
  const { address: contractAddress, abi } = contractsConfig.DnANFT
  const [nfts, setNfts] = useState<NFTItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const { data, refetch } = useReadContract({
    address: contractAddress,
    abi,
    functionName: 'getAllNFTs',
  })

  const gatewayDomain =
    import.meta.env.VITE_PINATA_GATEWAY_DOMAIN || 'gateway.pinata.cloud'

  useEffect(() => {
    async function loadNFTs() {
      if (!data || !Array.isArray(data)) return
      setIsLoading(true)

      try {
        const [ids, owners, uris, prices] = data as [
          bigint[],
          string[],
          string[],
          bigint[],
        ]

        const formatted = await Promise.all(
          ids.map(async (id, i) => {
            const tokenId = Number(id)
            const owner = owners[i]
            const price = (Number(prices[i]) / 1e18).toFixed(3)
            const uri = uris[i]

            let image = ''
            let name = ''
            let description = ''

            if (uri && uri.startsWith('ipfs://')) {
              try {
                const metadataUrl = ipfsToHttp(uri, gatewayDomain)
                const res = await fetch(metadataUrl)

                if (!res.ok) {
                  throw new Error(`Fetch failed (${res.status})`)
                }

                const metadata = await res.json()
                name = metadata.name || `Token #${tokenId}`
                description = metadata.description || ''
                image = metadata.image
                  ? ipfsToHttp(metadata.image, gatewayDomain)
                  : ''
              } catch (err) {
                console.warn(
                  `Error loading metadata for token ${tokenId}:`,
                  err
                )
              }
            } else {
              console.warn(`Token ${tokenId} has an invalid URI: ${uri}`)
            }

            return { tokenId, name, description, image, owner, price }
          })
        )

        setNfts(formatted)
      } catch (err: any) {
        console.error('An error occurred while loading NFT:', err)
        setError(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadNFTs()
  }, [data, gatewayDomain])

  useWatchContractEvent({
    address: contractAddress,
    abi,
    eventName: 'Minted',
    onLogs: () => refetch(),
  })

  useWatchContractEvent({
    address: contractAddress,
    abi,
    eventName: 'PriceSet',
    onLogs: () => refetch(),
  })

  return { nfts, isLoading, error, refetch }
}
