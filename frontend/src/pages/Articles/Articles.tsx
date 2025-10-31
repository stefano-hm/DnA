import { useEffect, useState } from 'react'
import { loadArticles } from '../../utils/loadArticles'
import type { Article } from '../../types/article'
import { ArticleCard } from '../../components/ArticlesComponents/ArticleCard/ArticleCard'
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

  return (
    <section className={styles.container}>
      <h1 className={styles.title}>All Articles</h1>
      <div className={styles.grid}>
        {articles.length === 0 ? (
          <p className={styles.empty}>No articles found.</p>
        ) : (
          articles.map(article => (
            <ArticleCard key={article.slug} article={article} />
          ))
        )}
      </div>
    </section>
  )
}
