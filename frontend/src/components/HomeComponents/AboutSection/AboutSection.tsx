import styles from './AboutSection.module.css'

export function AboutSection() {
  return (
    <section className={styles.about}>
      <div className={styles.container}>
        <h2 className={styles.heading}>About DnA</h2>
        <p className={styles.text}>
          DnA is a research-based initiative focused on human well-being and
          cognitive performance. The project integrates verified scientific
          knowledge with decentralized systems to ensure transparency,
          permanence, and open access to information.
        </p>
        <p className={styles.text}>
          Our goal is to bridge the gap between modern science and digital
          ownership — enabling readers, researchers, and creators to interact
          with content in a verifiable and trustless way through blockchain
          technology.
        </p>
      </div>
    </section>
  )
}
