import { useEffect, useState } from 'react'
import { useReadContract } from 'wagmi'
import { contractsConfig } from '../contracts/contractsConfig'
import type { NFTItem } from '../types/nft'
import { ipfsToHttp } from '../services/ipfsService'

export function useOwnedNFTs(userAddress: string | undefined) {
  const { address: contractAddress, abi } = contractsConfig.DnANFT
  const [nfts, setNfts] = useState<NFTItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const { data, refetch } = useReadContract({
    address: contractAddress,
    abi,
    functionName: 'getOwnedNFTs',
    args: userAddress ? [userAddress] : undefined,
  })

  const gatewayDomain =
    import.meta.env.VITE_PINATA_GATEWAY_DOMAIN || 'gateway.pinata.cloud'

  useEffect(() => {
    async function loadNFTs() {
      if (!data || !Array.isArray(data) || !userAddress) return
      setIsLoading(true)

      try {
        const [ids, uris] = data as [bigint[], string[]]
        const formatted = await Promise.all(
          ids.map(async (id, i) => {
            const tokenId = Number(id)
            const uri = uris[i]

            let image = ''
            let name = ''
            let description = ''

            if (uri && uri.startsWith('ipfs://')) {
              try {
                const metadataUrl = ipfsToHttp(uri, gatewayDomain)
                const res = await fetch(metadataUrl)
                if (!res.ok) throw new Error(`Fetch failed (${res.status})`)
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
            }

            return {
              tokenId,
              name,
              description,
              image,
              owner: userAddress,
            }
          })
        )

        setNfts(formatted)
      } catch (err: any) {
        console.error('Error loading owned NFTs:', err)
        setError(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadNFTs()
  }, [data, gatewayDomain, userAddress])

  return { nfts, isLoading, error, refetch }
}
