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

  if (featured.length === 0) return null

  return (
    <section className={styles.featuredSection}>
      <h2 className={styles.featuredHeading}>Featured Articles</h2>
      <div className={styles.featuredGrid}>
        {featured.map(article => (
          <Link
            key={article.slug}
            to={`/articles/${article.slug}`}
            className={styles.articleCard}
          >
            <div className={styles.imageWrapper}>
              <img
                src={article.image}
                alt={article.title}
                className={styles.image}
              />
            </div>

            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>{article.title}</h3>
              {article.subtitle ? (
                <p className={styles.cardExcerpt}>{article.subtitle}</p>
              ) : (
                <p className={styles.cardExcerpt}>Read the full article →</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
