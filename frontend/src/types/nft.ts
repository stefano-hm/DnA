export type NFTItem = {
  tokenId: number
  name: string
  description: string
  image: string
  owner: string
  price?: string
}

export type NFTCardProps = NFTItem & {
  refetch?: () => void
}

export type BuyButtonProps = {
  tokenId: number
  price: string
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
