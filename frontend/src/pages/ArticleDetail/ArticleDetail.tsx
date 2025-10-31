import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { loadArticles } from '../../utils/loadArticles'
import type { Article } from '../../types/article'
import styles from './ArticleDetail.module.css'

export default function ArticleDetail() {
  const { slug } = useParams()
  const [article, setArticle] = useState<Article | null>(null)

  useEffect(() => {
    const fetch = async () => {
      const all = await loadArticles()
      const found = all.find(a => a.slug === slug)
      setArticle(found || null)
    }
    fetch()
  }, [slug])

  if (!article) return <p className={styles.loading}>Loading...</p>

  return (
    <article className={styles.article}>
      <h1 className={styles.title}>{article.title}</h1>
      {article.subtitle && (
        <h2 className={styles.subtitle}>{article.subtitle}</h2>
      )}
      <div className={styles.meta}>
        <span>{article.author}</span>
        <span>• {new Date(article.date).toLocaleDateString()}</span>
        {article.category && <span>• {article.category}</span>}
      </div>
      <div className={styles.content}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
        >
          {article.content}
        </ReactMarkdown>
      </div>
    </article>
  )
}
