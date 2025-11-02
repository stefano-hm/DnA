import styles from './CategoryHeaderCard.module.css'

interface Props {
  category: string
}

export function CategoryHeaderCard({ category }: Props) {
  const slug = category.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className={styles.headerCard} aria-label={`Category ${category}`}>
      <h2 className={styles.title}>{category}</h2>
      <a href={`/articles/category/${slug}`} className={styles.viewAll}>
        View All
      </a>
    </div>
  )
}
