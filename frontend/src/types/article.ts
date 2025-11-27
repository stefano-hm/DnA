export interface Article {
  title: string
  subtitle?: string
  category: string
  date: string
  author?: string
  nftAccess?: boolean
  nftId?: number | string
  tags?: string[]
  content: string
  slug: string
  image: string
}
