import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { Layout } from './components/Layout/Layout'
import { Loader } from './components/Loader/Loader'

const Home = lazy(() => import('./pages/Home/Home'))
const Articles = lazy(() => import('./pages/Articles/Articles'))
const ArticleDetail = lazy(() => import('./pages/ArticleDetail/ArticleDetail'))
const Store = lazy(() => import('./pages/Store/Store'))
const AuctionHouse = lazy(() => import('./pages/AuctionHouse/AuctionHouse'))
const MyNFTs = lazy(() => import('./pages/MyNFTs/MyNFTs'))
const NFTDetail = lazy(() => import('./pages/NFTDetail/NFTDetail'))
const About = lazy(() => import('./pages/About/About'))

function App() {
  return (
    <Router>
      <Layout>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/articles/:slug" element={<ArticleDetail />} />
            <Route path="/store" element={<Store />} />
            <Route path="/auction-house" element={<AuctionHouse />} />
            <Route path="/my-nfts" element={<MyNFTs />} />
            <Route path="/nft/:id" element={<NFTDetail />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  )
}

export default App
