import { useCallback, useEffect, useState } from 'react'
import { useReadContract, useWatchContractEvent } from 'wagmi'
import { contractsConfig } from '../contracts/contractsConfig'
import { cidToGatewayUrl } from '../services/ipfsService'
import { useWatchBids } from './useWatchBids'
import type { AuctionItem } from '../types/auction'

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export function useAuctionData() {
  const { address: contractAddress, abi } = contractsConfig.DnAAuctionHouse
  const [auctions, setAuctions] = useState<AuctionItem[]>([])

  const { data: auctionCount, refetch: refetchCount } = useReadContract({
    address: contractAddress,
    abi,
    functionName: 'auctionCount',
  })

  const fetchAuctions = useCallback(async () => {
    if (!auctionCount) return

    const ethers = await import('ethers')
    const provider = new ethers.BrowserProvider(window.ethereum)
    const auctionContract = new ethers.Contract(contractAddress, abi, provider)

    const list: AuctionItem[] = []

    for (let i = 1; i <= Number(auctionCount); i++) {
      const a = await auctionContract.auctions(i)

      const baseAuction: AuctionItem = {
        id: i,
        nft: a.nft,
        tokenId: Number(a.tokenId),
        seller: a.seller,
        claimed: Boolean(a.claimed),
        startingBid: ethers.formatEther(a.startingBid),
        highestBid: ethers.formatEther(a.highestBid),
        endTime: Number(a.endTime),
        active: Boolean(a.active),
        highestBidder: a.highestBidder,
        hasWinner:
          typeof a.highestBidder === 'string' &&
          a.highestBidder.toLowerCase() !== ZERO_ADDRESS,
      }

      try {
        const nftContract = new ethers.Contract(
          a.nft,
          ['function tokenURI(uint256 tokenId) view returns (string)'],
          provider
        )

        const tokenUri: string = await nftContract.tokenURI(a.tokenId)
        const metadataUrl = tokenUri.startsWith('ipfs://')
          ? cidToGatewayUrl(tokenUri.replace('ipfs://', ''))
          : tokenUri

        const metadata = await fetch(metadataUrl).then(res => res.json())

        const imageUrl =
          metadata.image && typeof metadata.image === 'string'
            ? metadata.image.startsWith('ipfs://')
              ? cidToGatewayUrl(metadata.image.replace('ipfs://', ''))
              : metadata.image
            : '/placeholder.jpg'

        list.push({
          ...baseAuction,
          title: metadata.name || `NFT #${baseAuction.tokenId}`,
          image: imageUrl,
        })
      } catch {
        list.push({
          ...baseAuction,
          title: `NFT #${baseAuction.tokenId}`,
          image: '/placeholder.jpg',
        })
      }
    }

    setAuctions(list)
  }, [auctionCount, contractAddress, abi])

  useEffect(() => {
    fetchAuctions()
  }, [fetchAuctions])

  useWatchBids(({ auctionId, bidder, amount }) => {
    setAuctions(prev =>
      prev.map(a =>
        a.id === auctionId
          ? {
              ...a,
              highestBid: amount,
              highestBidder: bidder,
              hasWinner: bidder.toLowerCase() !== ZERO_ADDRESS,
            }
          : a
      )
    )
  })

  useWatchContractEvent({
    address: contractAddress,
    abi,
    eventName: 'AuctionStarted',
    onLogs: async () => {
      await refetchCount()
      await fetchAuctions()
    },
  })

  useWatchContractEvent({
    address: contractAddress,
    abi,
    eventName: 'AuctionEnded',
    onLogs: async () => {
      await fetchAuctions()
    },
  })

  useWatchContractEvent({
    address: contractAddress,
    abi,
    eventName: 'Claimed',
    onLogs: async () => {
      await fetchAuctions()
    },
  })

  const activeAuctions = auctions.filter(a => a.active)
  const endedAuctions = auctions.filter(a => !a.active)

  return {
    loading: auctionCount == null,
    activeAuctions,
    endedAuctions,
  }
}
