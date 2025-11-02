import { Link } from 'react-router-dom'
import styles from './CategoriesGrid.module.css'

type Category = {
  name: string
  path: string
}

const categories: Category[] = [
  { name: 'Sleep & Circadian Rhythm', path: '/articles/sleep' },
  { name: 'Nutrition', path: '/articles/nutrition' },
  { name: 'Attention & Focus', path: '/articles/focus' },
  { name: 'Meditation & Stress', path: '/articles/meditation' },
  { name: 'Physical Performance', path: '/articles/performance' },
  { name: 'Cognitive Health', path: '/articles/cognition' },
]

export function CategoriesGrid() {
  return (
    <section className={styles.categories}>
      <h2 className={styles.heading}>Explore Topics</h2>
      <div className={styles.grid}>
        {categories.map(category => (
          <Link key={category.path} to={category.path} className={styles.card}>
            <h3 className={styles.title}>{category.name}</h3>
          </Link>
        ))}
      </div>
    </section>
  )
}
