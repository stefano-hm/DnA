import { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { loadArticles } from '../../utils/loadArticles'
import type { Article } from '../../types/article'
import { ArticleCard } from '../../components/ArticlesComponents/ArticleCard/ArticleCard'
import styles from './Articles.module.css'

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const [searchParams] = useSearchParams()
  const initialCategory = searchParams.get('category')

  useEffect(() => {
    document.body.classList.add('articles-scroll')
    return () => {
      document.body.classList.remove('articles-scroll')
    }
  }, [])

  useEffect(() => {
    const fetchArticles = async () => {
      const loaded = await loadArticles()
      setArticles(loaded)

      const categories = Array.from(
        new Set(loaded.map(a => a.category).filter(Boolean))
      )

      if (initialCategory && categories.includes(initialCategory)) {
        setSelectedCategory(initialCategory)
      } else {
        setSelectedCategory(categories[0] ?? null)
      }
    }

    fetchArticles()
  }, [initialCategory])

  const categories = useMemo(
    () => Array.from(new Set(articles.map(a => a.category).filter(Boolean))),
    [articles]
  )

  const filtered = useMemo(() => {
    if (!selectedCategory) return []

    return articles
      .filter(a => a.category === selectedCategory)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [articles, selectedCategory])

  const spotlight = filtered.slice(0, 2)
  const rest = filtered.slice(2)

  return (
    <section className={styles.articlesPage}>
      <h1 className={styles.articlesTitle}>Articles</h1>

      <div className={styles.categoriesRow}>
        {categories.map(cat => (
          <button
            key={cat}
            type="button"
            className={`${styles.categoryPill} ${
              cat === selectedCategory ? styles.categoryPillActive : ''
            }`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {selectedCategory && filtered.length === 0 && (
        <p className={styles.emptyText}>
          No articles available for this category.
        </p>
      )}

      {filtered.length > 0 && (
        <>
          <div className={styles.spotlightGrid}>
            {spotlight.map(article => (
              <ArticleCard key={article.slug} article={article} spotlight />
            ))}
          </div>

          {rest.length > 0 && (
            <div className={styles.grid3}>
              {rest.map(article => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  )
}
