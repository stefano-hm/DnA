import fm from 'front-matter'
import type { Article } from '../types/article'

function toBool(v: unknown, def = false): boolean {
  if (typeof v === 'boolean') return v
  if (typeof v === 'string')
    return ['true', '1', 'yes'].includes(v.toLowerCase())
  if (typeof v === 'number') return v !== 0
  return def
}

function toTags(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String)
  if (typeof v === 'string')
    return v
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
  return []
}

function toDateISO(v: unknown, fallback = '1970-01-01'): string {
  if (typeof v === 'string' && !Number.isNaN(Date.parse(v)))
    return new Date(v).toISOString()
  return new Date(fallback).toISOString()
}

export async function loadArticles(): Promise<Article[]> {
  const modules = import.meta.glob<string>('/src/content/**/*.md', {
    query: '?raw',
    import: 'default',
  })

  const articles: Article[] = []

  for (const [path, loader] of Object.entries(modules)) {
    const raw = await loader()
    const { attributes, body } = fm<any>(raw)
    const slug = path.split('/').pop()?.replace('.md', '') || ''

    const nftIdRaw = attributes?.nftId
    const nftId =
      typeof nftIdRaw === 'number'
        ? nftIdRaw
        : typeof nftIdRaw === 'string' && nftIdRaw.trim() !== ''
          ? Number.isNaN(Number(nftIdRaw))
            ? nftIdRaw
            : Number(nftIdRaw)
          : undefined

    articles.push({
      title: attributes?.title || slug,
      subtitle: attributes?.subtitle,
      category: attributes?.category,
      date: toDateISO(attributes?.date),
      author: attributes?.author,
      nftAccess: toBool(attributes?.nftAccess, false),
      nftId,
      tags: toTags(attributes?.tags),
      content: body,
      slug,
      image: attributes?.image || '/article-images/default.jpg',
    })
  }

  return articles.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}
