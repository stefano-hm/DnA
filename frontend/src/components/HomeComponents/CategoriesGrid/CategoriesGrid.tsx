import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { loadArticles } from '../../../utils/loadArticles'
import type { Article } from '../../../types/article'
import styles from './CategoriesGrid.module.css'

export function CategoriesGrid() {
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      const all: Article[] = await loadArticles()
      const uniqueCategories = Array.from(
        new Set(all.map(a => a.category?.trim()).filter(Boolean) as string[])
      )
      setCategories(uniqueCategories)
    }

    fetchCategories()
  }, [])

  return (
    <section className={styles.categoriesSection}>
      <h2 className={styles.categoriesHeading}>Explore Topics</h2>
      <div className={styles.categoryGrid}>
        {categories.map(category => (
          <Link
            key={category}
            to={`/articles?category=${encodeURIComponent(category)}`}
            className={styles.categoryCard}
          >
            <h3 className={styles.categoryTitle}>{category}</h3>
          </Link>
        ))}
      </div>
    </section>
  )
}
