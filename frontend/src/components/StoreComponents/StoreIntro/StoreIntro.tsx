import styles from './StoreIntro.module.css'

export function StoreIntro() {
  return (
    <section className={styles.intro}>
      <h1 className={styles.title}>DnA NFT Store</h1>
      <div className={styles.subtitle}>
        <p>
          Collect unique digital assets inspired by science, human well-being
          and decentralized technology.
        </p>
        <br />
        <p>
          Each NFT in this collection represents a unique concept linked to
          scientific themes, digital identity or human well-being. All assets
          are permanently stored on-chain and fully owned by the holder.
        </p>
      </div>
    </section>
  )
}
