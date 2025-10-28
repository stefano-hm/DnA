import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { useAccount } from 'wagmi'
import toast from 'react-hot-toast'
import { useMintNFT } from '../../../hooks/useMintNFT'
import {
  uploadImageToIPFS,
  createAndUploadMetadata,
  cidToGatewayUrl,
} from '../../../services/ipfsService'
import styles from './MintButton.module.css'

const ADMIN_ADDRESS = '0xCdD94FC9056554E2D3f222515fB52829572c7095'

export function MintButton() {
  const { address: userAddress } = useAccount()
  const { mintNFT } = useMintNFT()
  const [txHash, setTxHash] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageFile: null as File | null,
    price: '',
  })

  const isAdmin = userAddress?.toLowerCase() === ADMIN_ADDRESS.toLowerCase()
  if (!isAdmin) return null

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData(prev => ({ ...prev, imageFile: file }))
  }

  const handleMint = async () => {
    try {
      if (!userAddress) {
        toast.error('Connect your wallet first')
        return
      }

      const { title, description, imageFile, price } = formData
      if (!title || !description || !imageFile || !price) {
        toast.error('Please fill in all fields')
        return
      }

      toast.loading('Uploading to IPFS...')

      const imageCid = await uploadImageToIPFS(imageFile)
      const imageURI = `ipfs://${imageCid}`

      const metadataURI = await createAndUploadMetadata({
        name: title,
        description,
        imageURI,
      })

      toast.dismiss()
      toast.loading('Minting NFT...')

      const hash = await mintNFT(
        userAddress,
        title,
        description,
        metadataURI,
        price,
        (window as any).refetchNFTs
      )

      toast.dismiss()

      if (hash) {
        setTxHash(hash)
        setFormData({ title: '', description: '', imageFile: null, price: '' })

        const gatewayLink = cidToGatewayUrl(metadataURI.replace('ipfs://', ''))

        toast.success('NFT minted successfully! Metadata pinned to IPFS.', {
          duration: 6000,
        })

        console.log('Metadata Gateway URL:', gatewayLink)
      }
    } catch (err) {
      toast.dismiss()
      console.error(err)
      toast.error('Mint failed — check console for details')
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
        type="file"
        accept="image/*"
        onChange={handleFileChange}
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
