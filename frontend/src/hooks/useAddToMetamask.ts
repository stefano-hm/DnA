import toast from 'react-hot-toast'
import { readContract } from '@wagmi/core'
import { contractsConfig } from '../contracts/contractsConfig'
import { wagmiConfig } from '../wagmiConfig'

export function useAddToMetamask(onAdded?: () => void) {
  const addToMetamask = async (
    nftAddress: string,
    tokenId: number,
    image?: string
  ) => {
    if (!window.ethereum) {
      toast.error('MetaMask not detected')
      return false
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' })
      const userAddress = accounts?.[0]

      const currentOwner = (await readContract(wagmiConfig, {
        address: nftAddress as `0x${string}`,
        abi: contractsConfig.DnANFT.abi,
        functionName: 'ownerOf',
        args: [BigInt(tokenId)],
      })) as string

      if (
        !userAddress ||
        currentOwner.toLowerCase() !== userAddress.toLowerCase()
      ) {
        toast.error('You must own this NFT to add it to MetaMask')
        return false
      }

      const wasAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC721',
          options: {
            address: nftAddress,
            symbol: 'DnA-NFT',
            tokenId: tokenId.toString(),
            image: image || '/placeholder.jpg',
          },
        },
      })

      if (wasAdded) {
        toast.success('NFT added to MetaMask!')
        onAdded?.()
        return true
      } else {
        toast('NFT not added')
        return false
      }
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message || 'Failed to add NFT to MetaMask')
      return false
    }
  }

  return { addToMetamask }
}
