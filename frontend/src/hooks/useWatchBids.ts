import { useWatchContractEvent } from 'wagmi'
import toast from 'react-hot-toast'
import { contractsConfig } from '../contracts/contractsConfig'

type BidPlacedEvent = {
  auctionId: bigint
  bidder: `0x${string}`
  amount: bigint
}

export function useWatchBids(
  onBidPlaced: (params: {
    auctionId: number
    bidder: string
    amount: string
  }) => void
) {
  const { address: contractAddress, abi } = contractsConfig.DnAAuctionHouse

  useWatchContractEvent({
    address: contractAddress,
    abi,
    eventName: 'BidPlaced',
    onLogs: logs => {
      const typedLogs = logs as unknown as Array<{ args?: BidPlacedEvent }>
      typedLogs.forEach(log => {
        const args = log.args
        if (!args) return

        const auctionId = Number(args.auctionId)
        const bidder = args.bidder
        const amountEth = (Number(args.amount) / 1e18).toFixed(3)
        const shortAddress = `${bidder.slice(0, 6)}...${bidder.slice(-4)}`

        toast(
          `New bid: ${amountEth} ETH on auction #${auctionId} by ${shortAddress}`,
          {
            duration: 4000,
          }
        )

        onBidPlaced({
          auctionId,
          bidder,
          amount: amountEth,
        })
      })
    },
  } as const)
}
