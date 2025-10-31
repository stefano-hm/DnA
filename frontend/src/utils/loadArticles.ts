import fm from 'front-matter'
import type { Article } from '../types/article'

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

    articles.push({
      title: attributes.title || slug,
      subtitle: attributes.subtitle,
      category: attributes.category,
      date: attributes.date || '1970-01-01',
      author: attributes.author,
      level: attributes.level,
      nftAccess: attributes.nftAccess,
      tags: attributes.tags,
      content: body,
      slug,
    })
  }

  return articles.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}
