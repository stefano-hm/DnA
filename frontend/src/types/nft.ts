export type NFTItem = {
  tokenId: number
  name: string
  description: string
  image: string
  owner: string
  price: string
}

export type NFTCardProps = NFTItem & {
  refetch?: () => void
}

export type BuyButtonProps = {
  tokenId: number
  price: string
  refetch?: () => void
}
