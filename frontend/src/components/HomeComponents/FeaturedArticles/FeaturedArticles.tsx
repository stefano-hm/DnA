import { Link } from 'react-router-dom'
import styles from './FeaturedArticles.module.css'

type Article = {
  title: string
  excerpt: string
  image: string
  path: string
}

const featuredArticles: Article[] = [
  {
    title: 'How Light Shapes the Circadian Rhythm',
    excerpt:
      'An in-depth look at how natural and artificial light exposure affects our sleep, alertness, and hormonal balance.',
    image: '/images/circadian-light.jpg',
    path: '/articles/sleep/how-light-affects-circadian-rhythm',
  },
  {
    title: 'Nutrition and Cognitive Function',
    excerpt:
      'Exploring how micronutrients and dietary patterns influence brain performance, attention, and memory.',
    image: '/images/nutrition-brain.jpg',
    path: '/articles/nutrition/nutrition-and-cognitive-function',
  },
]

export function FeaturedArticles() {
  return (
    <section className={styles.featured}>
      <h2 className={styles.heading}>Featured Articles</h2>
      <div className={styles.grid}>
        {featuredArticles.map(article => (
          <Link key={article.path} to={article.path} className={styles.card}>
            <div className={styles.imageWrapper}>
              <img
                src={article.image}
                alt={article.title}
                className={styles.image}
              />
            </div>
            <div className={styles.content}>
              <h3 className={styles.title}>{article.title}</h3>
              <p className={styles.excerpt}>{article.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
