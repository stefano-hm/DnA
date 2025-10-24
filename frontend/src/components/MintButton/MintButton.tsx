import { useState } from 'react'
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from 'wagmi'
import { parseEther } from 'viem'
import toast from 'react-hot-toast'
import { contractsConfig } from '../../contracts/contractsConfig'
import styles from './MintButton.module.css'

const ADMIN_ADDRESS = '0xCdD94FC9056554E2D3f222515fB52829572c7095'

export function MintButton() {
  const { address: contractAddress, abi } = contractsConfig.DnANFT
  const { address: userAddress } = useAccount()
  const [txHash, setTxHash] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    price: '',
  })

  const isAdmin = userAddress?.toLowerCase() === ADMIN_ADDRESS.toLowerCase()

  const { writeContract, data, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: data,
  })

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
      const tokenId = Date.now()
      const uri = `ipfs://your-metadata-link-for-${tokenId}`
      const normalizedPrice = price.replace(',', '.')
      const parsedPrice = parseEther(normalizedPrice)

      writeContract(
        {
          address: contractAddress,
          abi,
          functionName: 'mintTo',
          args: [userAddress, tokenId, uri],
        },
        {
          onSuccess: async hash => {
            setTxHash(hash)
            toast.loading('Minting in progress...', { id: 'mint' })

            setTimeout(async () => {
              try {
                await writeContract({
                  address: contractAddress,
                  abi,
                  functionName: 'setTokenPrice',
                  args: [tokenId, parsedPrice],
                })
                toast.success('Price set successfully!')

                setFormData({
                  title: '',
                  description: '',
                  image: '',
                  price: '',
                })
              } catch (err) {
                console.error(err)
                toast.error('Failed to set price')
              }
            }, 3000)
          },
          onError: err => {
            console.error(err)
            toast.error('Mint failed')
          },
        }
      )
    } catch (err) {
      console.error(err)
      toast.error('Transaction error')
    }
  }

  if (isConfirming) toast.loading('Waiting for confirmation...', { id: 'mint' })
  if (isSuccess) toast.success('NFT minted successfully!', { id: 'mint' })

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

      <button
        onClick={handleMint}
        disabled={isPending || isConfirming}
        className={styles.button}
      >
        {isPending || isConfirming ? 'Minting...' : 'Mint NFT'}
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
