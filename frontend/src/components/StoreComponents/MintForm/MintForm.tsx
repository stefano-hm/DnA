import { useAccount } from 'wagmi'
import { useState } from 'react'
import { MintButton } from '../MintButton/MintButton'
import type { FormDataType } from '../../../types/nft'
import type { MintFormProps } from '../../../types/nft'
import styles from './MintForm.module.css'

const ADMIN_ADDRESS = import.meta.env.VITE_ADMIN_ADDRESS

export function MintForm({ onMintSuccess }: MintFormProps) {
  const { address: userAddress } = useAccount()
  const [formData, setFormData] = useState<FormDataType>({
    title: '',
    description: '',
    imageFile: null,
    price: '',
  })

  const isAdmin = userAddress?.toLowerCase() === ADMIN_ADDRESS.toLowerCase()

  const handleSuccess = (hash: string) => {
    setFormData({ title: '', description: '', imageFile: null, price: '' })
    onMintSuccess?.(hash)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData(prev => ({ ...prev, imageFile: file }))
  }

  if (!isAdmin) return null

  return (
    <div className={styles.formContainer}>
      <h3 className={styles.formTitle}>Create New NFT</h3>

      <input
        type="text"
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        className={styles.formInput}
      />

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className={styles.formTextarea}
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className={styles.formInput}
      />

      <input
        type="text"
        name="price"
        placeholder="Price in ETH"
        value={formData.price}
        onChange={handleChange}
        className={styles.formInput}
      />

      <MintButton formData={formData} onSuccess={handleSuccess} />
    </div>
  )
}
