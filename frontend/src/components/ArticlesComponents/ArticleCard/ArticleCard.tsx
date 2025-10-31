import type { Article } from '../../../types/article'
import styles from './ArticleCard.module.css'

interface ArticleCardProps {
  article: Article
}

export function ArticleCard({ article }: ArticleCardProps) {
  const { title, date, category, author, content, slug } = article

  const preview = content.length > 200 ? content.slice(0, 200) + '…' : content

  return (
    <article className={styles.card}>
      <h2 className={styles.title}>{title}</h2>

      <div className={styles.meta}>
        <span>{new Date(date).toLocaleDateString()}</span>
        {category && <span>• {category}</span>}
        {author && <span>• {author}</span>}
      </div>

      <p className={styles.preview}>{preview}</p>

      <a href={`/articles/${slug}`} className={styles.link}>
        Read more →
      </a>
    </article>
  )
}
