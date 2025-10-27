import { useState } from 'react'
import { useAccount } from 'wagmi'
import toast from 'react-hot-toast'
import { useMintNFT } from '../../../hooks/useMintNFT'
import styles from './MintButton.module.css'

const ADMIN_ADDRESS = '0xCdD94FC9056554E2D3f222515fB52829572c7095'

export function MintButton() {
  const { address: userAddress } = useAccount()
  const { mintNFT } = useMintNFT()
  const [txHash, setTxHash] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    price: '',
  })

  const isAdmin = userAddress?.toLowerCase() === ADMIN_ADDRESS.toLowerCase()
  if (!isAdmin) return null

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleMint = async () => {
    if (!userAddress) {
      toast.error('Connect your wallet first')
      return
    }

    const { title, description, image, price } = formData
    if (!title || !description || !image || !price) {
      toast.error('Please fill in all fields')
      return
    }

    const hash = await mintNFT(
      userAddress,
      title,
      price,
      (window as any).refetchNFTs
    )

    if (hash) {
      setTxHash(hash)
      setFormData({ title: '', description: '', image: '', price: '' })
    }
  }

  return (
    <div className={styles.container}>
      <h3>Create New NFT</h3>

      <input
        type="text"
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        className={styles.input}
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className={styles.textarea}
      />
      <input
        type="text"
        name="image"
        placeholder="Image URL (ipfs or https)"
        value={formData.image}
        onChange={handleChange}
        className={styles.input}
      />
      <input
        type="text"
        name="price"
        placeholder="Price in ETH"
        value={formData.price}
        onChange={handleChange}
        className={styles.input}
      />

      <button onClick={handleMint} className={styles.button}>
        Mint NFT
      </button>

      {txHash && (
        <p className={styles.linkText}>
          View on{' '}
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Etherscan
          </a>
        </p>
      )}
    </div>
  )
}
