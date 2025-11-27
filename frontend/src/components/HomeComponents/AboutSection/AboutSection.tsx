import styles from './AboutSection.module.css'

export function AboutSection() {
  return (
    <section className={styles.aboutSection}>
      <div className={styles.overlay} />

      <div className={styles.aboutContainer}>
        <h2 className={styles.aboutHeading}>About DnA</h2>

        <p className={styles.aboutText}>
          DnA combines scientific research with decentralized tech to make
          knowledge transparent and permanently accessible.
        </p>

        <p className={styles.aboutText}>
          Its mission is to connect modern science with digital ownership,
          enabling trustless and verified access to information.
        </p>

        <a href="/about" className={styles.aboutButton}>
          Learn more about us
        </a>
      </div>
    </section>
  )
}
