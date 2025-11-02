import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { loadArticles } from '../../utils/loadArticles'
import type { Article } from '../../types/article'
import { ArticleCard } from '../../components/ArticlesComponents/ArticleCard/ArticleCard'
import styles from './Category.module.css'

export default function CategoryPage() {
  const { slug } = useParams()
  const [articles, setArticles] = useState<Article[]>([])
  const [categoryName, setCategoryName] = useState<string>('')

  useEffect(() => {
    const fetchArticles = async () => {
      const all = await loadArticles()

      const category =
        slug?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || ''

      const filtered = all.filter(
        a => a.category.toLowerCase() === category.toLowerCase()
      )

      setCategoryName(category)
      setArticles(filtered)
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
