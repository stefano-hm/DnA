import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { loadArticles } from '../../../utils/loadArticles'
import type { Article } from '../../../types/article'
import styles from './FeaturedArticles.module.css'

export function FeaturedArticles() {
  const [featured, setFeatured] = useState<Article[]>([])

  useEffect(() => {
    const fetch = async () => {
      const all = await loadArticles()

      setFeatured(all.slice(0, 2))
    }
    fetch()
  }, [])

  if (featured.length === 0) {
    return null
  }

  return (
    <section className={styles.featured}>
      <h2 className={styles.heading}>Featured Articles</h2>
      <div className={styles.grid}>
        {featured.map(article => (
          <Link
            key={article.slug}
            to={`/articles/${article.slug}`}
            className={styles.card}
          >
            <div className={styles.imageWrapper}>
              <div className={styles.imageFallback} />
            </div>
            <div className={styles.content}>
              <h3 className={styles.title}>{article.title}</h3>
              {article.subtitle ? (
                <p className={styles.excerpt}>{article.subtitle}</p>
              ) : (
                <p className={styles.excerpt}>Read the full article →</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
