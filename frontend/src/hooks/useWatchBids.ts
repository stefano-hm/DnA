import { useRef } from 'react'
import { useWatchContractEvent } from 'wagmi'
import toast from 'react-hot-toast'
import { formatEther } from 'viem'
import { contractsConfig } from '../contracts/contractsConfig'

type BidPlacedArgs = {
  auctionId: bigint
  bidder: `0x${string}`
  amount: bigint
}

function formatEthCompact(valueWei: bigint, maxDecimals = 6) {
  const s = formatEther(valueWei)
  const [i, d = ''] = s.split('.')
  const cut = d.slice(0, maxDecimals).replace(/0+$/, '')
  return cut.length ? `${i}.${cut}` : i
}

export function useWatchBids(
  onBidPlaced: (params: {
    auctionId: number
    bidder: string
    amount: string
  }) => void
) {
  const { address: contractAddress, abi } = contractsConfig.DnAAuctionHouse
  const seen = useRef(new Set<string>())

  useWatchContractEvent({
    address: contractAddress,
    abi,
    eventName: 'BidPlaced',
    onLogs: logs => {
      logs.forEach((log: any) => {
        const key = `${log.transactionHash ?? '0x'}:${log.logIndex ?? 0}`
        if (seen.current.has(key)) return
        seen.current.add(key)

        const args = (log.args ?? {}) as BidPlacedArgs
        if (!args.auctionId || !args.bidder) return

        const auctionId = Number(args.auctionId)
        const bidder = args.bidder
        const amountEth = formatEthCompact(args.amount, 6)
        const shortAddress = `${bidder.slice(0, 6)}...${bidder.slice(-4)}`

        toast(
          `New bid: ${amountEth} ETH on auction #${auctionId} by ${shortAddress}`,
          {
            id: `bid-${key}`,
            duration: 3500,
          }
        )

        onBidPlaced({ auctionId, bidder, amount: amountEth })
      })
    },
  } as const)
}
