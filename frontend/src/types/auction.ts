export type AuctionFormData = {
  nftAddress: string
  tokenId: string
  startingBid: string
  duration: string
}

export type Auction = {
  id: number
  title: string
  image: string
  currentBid: string
  startingBid: string
  highestBid: string
  highestBidder?: string
  endTime: number
  endsIn: string
  active: boolean
  seller: string
  claimed: boolean
  hasWinner: boolean
}

export type AuctionCardProps = {
  auction: Auction
}

export type EndAuctionButtonProps = {
  auctionId: number
  onEnded?: (id: number) => void
}

export type ClaimButtonProps = {
  auctionId: number
  onClaimed?: (id: number) => void
}

export type BidFormProps = {
  auctionId: number
  startingBid: string
  highestBid: string
  endTime: number
  onClose: () => void
}

export type AuctionItem = {
  id: number
  tokenId: number
  startingBid: string
  highestBid: string
  endTime: number
  active: boolean
  highestBidder: string
  nft: string
  seller: string
  claimed: boolean
  hasWinner: boolean
  title?: string
  image?: string
}

export type EndedAuctionsProps = {
  auctions: Auction[]
}

export type AuctionStruct = {
  nft: string
  tokenId: bigint
  seller: string
  startingBid: bigint
  endTime: bigint
  active: boolean
  claimed: boolean
  highestBidder: string
  highestBid: bigint
}

export interface WithdrawButtonProps {
  auctionId: number
  userAddress: string | undefined
  onWithdrawn?: (auctionId: number) => void
}
