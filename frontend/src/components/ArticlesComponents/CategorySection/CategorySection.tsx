import type { Article } from '../../../types/article'
import { ArticleCard } from '../ArticleCard/ArticleCard'
import { CategoryHeaderCard } from './CategoryHeaderCard/CategoryHeaderCard'
import styles from './CategorySection.module.css'

interface Props {
  category: string
  articles: Article[]
}

export function CategorySection({ category, articles }: Props) {
  if (!articles || articles.length === 0) return null

  return (
    <section className={styles.section}>
      <CategoryHeaderCard category={category} />

      <div className={styles.carousel}>
        {articles.map(a => (
          <ArticleCard key={a.slug} article={a} />
        ))}
      </div>
    </section>
  )
}
