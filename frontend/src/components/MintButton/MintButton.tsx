import { useState } from 'react'
import { useWriteContract, useAccount, usePublicClient } from 'wagmi'
import { parseEther } from 'viem'
import toast from 'react-hot-toast'
import { contractsConfig } from '../../contracts/contractsConfig'
import styles from './MintButton.module.css'

const ADMIN_ADDRESS = '0xCdD94FC9056554E2D3f222515fB52829572c7095'

export function MintButton() {
  const { address: contractAddress, abi } = contractsConfig.DnANFT
  const { address: userAddress } = useAccount()
  const publicClient = usePublicClient()!
  const [txHash, setTxHash] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    price: '',
  })

  const isAdmin = userAddress?.toLowerCase() === ADMIN_ADDRESS.toLowerCase()
  const { writeContractAsync } = useWriteContract()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  if (!isAdmin) return null

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

    try {
      const uri = `ipfs://your-metadata-link-for-${title
        .replace(/\s+/g, '-')
        .toLowerCase()}`
      const normalizedPrice = price.replace(',', '.')
      const parsedPrice = parseEther(normalizedPrice)

      toast.loading('Minting NFT...', { id: 'mint' })

      const mintHash = await writeContractAsync({
        address: contractAddress,
        abi,
        functionName: 'mintTo',
        args: [userAddress, uri],
      })
      setTxHash(mintHash)

      const mintReceipt = await publicClient.waitForTransactionReceipt({
        hash: mintHash,
      })

      toast.success('NFT minted successfully!', { id: 'mint' })

      const transferLog = mintReceipt.logs.find(
        (l: any) =>
          Array.isArray(l.topics) &&
          l.topics.length > 3 &&
          typeof l.topics[0] === 'string' &&
          l.topics[0].includes('ddf252ad')
      )

      const tokenId = transferLog?.topics?.[3]
        ? BigInt(transferLog.topics[3] as string)
        : 1n

      console.log('Minted tokenId:', tokenId.toString())

      toast.loading('Setting token price...', { id: 'price' })
      const priceHash = await writeContractAsync({
        address: contractAddress,
        abi,
        functionName: 'setTokenPrice',
        args: [tokenId, parsedPrice],
      })

      await publicClient.waitForTransactionReceipt({ hash: priceHash })
      toast.success('Price set successfully!', { id: 'price' })

      setFormData({ title: '', description: '', image: '', price: '' })
    } catch (err: any) {
      console.error('Transaction error:', err)
      toast.error('Mint failed', { id: 'mint' })
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
