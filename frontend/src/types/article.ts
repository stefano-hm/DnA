export interface Article {
  title: string
  subtitle?: string
  category?: string
  date: string
  author?: string
  level?: string
  nftAccess?: boolean
  tags?: string[]
  content: string
  slug: string
}
