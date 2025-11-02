import { useEffect, useState } from 'react'
import { loadArticles } from '../../utils/loadArticles'
import type { Article } from '../../types/article'
import { CategorySection } from '../../components/ArticlesComponents/CategorySection/CategorySection'
import styles from './Articles.module.css'

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])

  useEffect(() => {
    const fetchArticles = async () => {
      const loaded = await loadArticles()
      setArticles(loaded)
    }
    fetchArticles()
  }, [])

  const grouped = articles.reduce<Record<string, Article[]>>((acc, a) => {
    const key = a.category || 'Uncategorized'
    if (!acc[key]) acc[key] = []
    acc[key].push(a)
    return acc
  }, {})

  return (
    <section className={styles.container}>
      <h1 className={styles.title}>All Articles</h1>
      {Object.entries(grouped).map(([category, group]) => (
        <CategorySection key={category} category={category} articles={group} />
      ))}
    </section>
  )
}
