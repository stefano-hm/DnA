import { Hero } from '../../components/HomeComponents/Hero/Hero'
import { AboutSection } from '../../components/HomeComponents/AboutSection/AboutSection'
import { CategoriesGrid } from '../../components/HomeComponents/CategoriesGrid/CategoriesGrid'
import { FeaturedArticles } from '../../components/HomeComponents/FeaturedArticles/FeaturedArticles'
import { Footer } from '../../components/HomeComponents/Footer/Footer'

export default function Home() {
  return (
    <>
      <Hero />
      <AboutSection />
      <CategoriesGrid />
      <FeaturedArticles />
      <Footer />
    </>
  )
}
