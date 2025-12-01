import { useReadContract } from 'wagmi'
import { contractsConfig } from '../contracts/contractsConfig'

export function useAuctionStatus(tokenId?: number) {
  const { address, abi } = contractsConfig.DnAAuctionHouse

  const { data } = useReadContract({
    address,
    abi,
    functionName: 'auctions',
    args: tokenId ? [BigInt(tokenId)] : undefined,
    query: { enabled: !!tokenId },
  })

  if (!data) return { isInAuction: false }

  const a = data as unknown[]
  const auctionActive = a?.[4] as boolean

  return {
    isInAuction: !!auctionActive,
  }
}
