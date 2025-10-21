import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Store from './pages/Store'
import MyNFTs from './pages/MyNFTs'
import NFTDetail from './pages/NFTDetail'
import About from './pages/About'

function App() {
  return (
    <Router>
      <nav
        style={{
          display: 'flex',
          gap: '1rem',
          padding: '1rem',
          borderBottom: '1px solid #ddd',
        }}
      >
        <Link to="/">Home</Link>
        <Link to="/store">Store</Link>
        <Link to="/my-nfts">My NFTs</Link>
        <Link to="/about">About</Link>
      </nav>

      <div style={{ padding: '2rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/store" element={<Store />} />
          <Route path="/my-nfts" element={<MyNFTs />} />
          <Route path="/nft/:id" element={<NFTDetail />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
