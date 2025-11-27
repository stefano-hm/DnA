import styles from './AboutIntro.module.css'

export function AboutIntro() {
  return (
    <section className={styles.section}>
      <div className={styles.overlay}></div>

      <h1 className={styles.title}>About DnA</h1>

      <p className={styles.text}>
        DnA is a scientific platform dedicated to human well-being, cognitive
        performance and applied neuroscience. Our goal is to take complex
        research and translate it into clear, practical and accessible insights
        without sacrificing scientific rigor.
      </p>
    </section>
  )
}
