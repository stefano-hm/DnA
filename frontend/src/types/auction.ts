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
  title?: string
  image?: string
}

export type EndedAuctionsProps = {
  auctions: Auction[]
}
