import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { useAccount, useReadContract } from 'wagmi'
import { loadArticles } from '../../utils/loadArticles'
import { contractsConfig } from '../../contracts/contractsConfig'
import type { Article } from '../../types/article'
import styles from './ArticleDetail.module.css'

export default function ArticleDetail() {
  const { slug } = useParams()
  const { address } = useAccount()
  const [article, setArticle] = useState<Article | null>(null)

  const { address: nftAddress, abi } = contractsConfig.DnANFT

  useEffect(() => {
    const fetch = async () => {
      const all = await loadArticles()
      const found = all.find(a => a.slug === slug)
      setArticle(found || null)
    }
    fetch()
  }, [slug])

  const { data: owner, error } = useReadContract({
    address: nftAddress,
    abi,
    functionName: 'ownerOf',
    args:
      article?.nftAccess && article?.nftId !== undefined
        ? [BigInt(article.nftId)]
        : undefined,
  })

  if (!article) return <p className={styles.loading}>Loading...</p>

  const ownerAddress = typeof owner === 'string' ? owner : undefined

  const hasAccess =
    !article.nftAccess ||
    (ownerAddress && ownerAddress.toLowerCase() === address?.toLowerCase())

  if (error && article.nftAccess) {
    console.warn('NFT ownership check error:', error)
  }

  if (!hasAccess) {
    return (
      <section className={styles.locked}>
        <h1 className={styles.title}>{article.title}</h1>
        <p className={styles.notice}>
          This article is restricted to the owner of NFT #{article.nftId}.
        </p>
        <p className={styles.hint}>
          Please connect your wallet or acquire the required NFT to unlock full
          access.
        </p>
      </section>
    )
  }

  return (
    <article className={styles.article}>
      <h1 className={styles.title}>{article.title}</h1>
      {article.subtitle && (
        <h2 className={styles.subtitle}>{article.subtitle}</h2>
      )}

      <div className={styles.meta}>
        {article.author && <span>{article.author}</span>}
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
