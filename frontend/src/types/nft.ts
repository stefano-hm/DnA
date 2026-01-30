export type NFTItem = {
  tokenId: number
  name: string
  description: string
  image: string
  owner: string
  price: string
  priceWei: bigint
}

export type NFTCardProps = NFTItem & {
  refetch?: () => void
  priceWei: bigint
}

export type BuyButtonProps = {
  tokenId: number
  priceWei: bigint
  refetch?: () => void
}

export type FormDataType = {
  title: string
  description: string
  imageFile: File | null
  price: string
}

export type MintFormProps = {
  onMintSuccess?: (hash: string) => void
}

export type MintButtonProps = {
  formData: FormDataType
  onSuccess?: (hash: string) => void
}

export interface AddToMetamaskButtonProps {
  nftAddress: string
  tokenId: number
  image?: string
}
