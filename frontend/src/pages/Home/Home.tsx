import { Hero } from '../../components/HomeComponents/Hero/Hero'
import { AboutSection } from '../../components/HomeComponents/AboutSection/AboutSection'
import { CategoriesGrid } from '../../components/HomeComponents/CategoriesGrid/CategoriesGrid'
import { FeaturedArticles } from '../../components/HomeComponents/FeaturedArticles/FeaturedArticles'
import { Footer } from '../../components/HomeComponents/Footer/Footer'
import styles from './Home.module.css'

export default function Home() {
  return (
    <div className={styles.pageSection}>
      <Hero />
      <CategoriesGrid />
      <FeaturedArticles />
      <AboutSection />
      <Footer />
    </div>
  )
}
