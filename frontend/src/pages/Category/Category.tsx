import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { loadArticles } from '../../utils/loadArticles'
import type { Article } from '../../types/article'
import { ArticleCard } from '../../components/ArticlesComponents/ArticleCard/ArticleCard'
import styles from './Category.module.css'

export default function Category() {
  const { slug } = useParams()
  const [articles, setArticles] = useState<Article[]>([])
  const [categoryName, setCategoryName] = useState<string>('')

  const deslugifyCategory = (slug: string) =>
    slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

  const slugifyCategory = (name: string) =>
    name
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

  useEffect(() => {
    const fetchArticles = async () => {
      if (!slug) return

      const all = await loadArticles()

      const filtered = all.filter(a => slugifyCategory(a.category) === slug)

      setArticles(filtered)

      if (filtered.length > 0) {
        setCategoryName(filtered[0].category)
      } else {
        setCategoryName(deslugifyCategory(slug))
      }
    }

    fetchArticles()
  }, [slug])

  if (articles.length === 0) {
    return (
      <section className={styles.container}>
        <h1 className={styles.title}>{categoryName}</h1>
        <p className={styles.empty}>No articles found in this category.</p>
      </section>
    )
  }

  return (
    <section className={styles.container}>
      <h1 className={styles.title}>{categoryName}</h1>
      <div className={styles.grid}>
        {articles.map(a => (
          <ArticleCard key={a.slug} article={a} />
        ))}
      </div>
    </section>
  )
}
