import type { Article } from '../../../types/article'
import styles from './ArticleCard.module.css'

interface Props {
  article: Article
  spotlight?: boolean
}

export function ArticleCard({ article, spotlight = false }: Props) {
  const { title, subtitle, date, author, slug, image } = article

  return (
    <article
      className={`${styles.card} ${spotlight ? styles.spotlight : styles.compact}`}
    >
      <a href={`/articles/${slug}`}>
        <img src={image} alt={title} className={styles.image} />
      </a>

      <div className={styles.text}>
        {author && <p className={styles.author}>{author}</p>}

        <a href={`/articles/${slug}`} className={styles.title}>
          {title}
        </a>

        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

        <p className={styles.meta}>{new Date(date).toLocaleDateString()}</p>
      </div>
    </article>
  )
}
