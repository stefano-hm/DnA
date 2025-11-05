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

  const slugifyCategory = (name: string) =>
    name
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

  return (
    <section className={styles.categories}>
      <h2 className={styles.heading}>Explore Topics</h2>
      <div className={styles.grid}>
        {categories.map(category => (
          <Link
            key={category}
            to={`/articles/category/${slugifyCategory(category)}`}
            className={styles.card}
          >
            <h3 className={styles.title}>{category}</h3>
          </Link>
        ))}
      </div>
    </section>
  )
}
