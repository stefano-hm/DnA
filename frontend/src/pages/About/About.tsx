import styles from './About.module.css'
import { AboutIntro } from '../../components/AboutComponents/AboutIntro/AboutIntro'
import { AboutOverview } from '../../components/AboutComponents/AboutOverview/AboutOverview'

export default function AboutPage() {
  return (
    <div className={styles.aboutPage}>
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <AboutIntro />
        </div>
      </section>

      <section className={styles.sections}>
        <AboutOverview />
      </section>
    </div>
  )
}
