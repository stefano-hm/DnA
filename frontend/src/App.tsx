import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { Navbar } from './components/Navbar/Navbar'
import { Loader } from './components/Loader/Loader'

const Home = lazy(() => import('./pages/Home/Home'))
const Store = lazy(() => import('./pages/Store/Store'))
const MyNFTs = lazy(() => import('./pages/MyNFTs/MyNFTs'))
const NFTDetail = lazy(() => import('./pages/NFTDetail/NFTDetail'))
const About = lazy(() => import('./pages/About/About'))

function App() {
  return (
    <Router>
      <Navbar />
      <main style={{ padding: '2rem' }}>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/store" element={<Store />} />
            <Route path="/my-nfts" element={<MyNFTs />} />
            <Route path="/nft/:id" element={<NFTDetail />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Suspense>
      </main>
    </Router>
  )
}

export default App
