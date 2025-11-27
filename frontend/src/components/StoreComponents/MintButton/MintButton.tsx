import { useAccount } from 'wagmi'
import toast from 'react-hot-toast'
import { useMintNFT } from '../../../hooks/useMintNFT'
import {
  uploadImageToIPFS,
  createAndUploadMetadata,
  cidToGatewayUrl,
} from '../../../services/ipfsService'
import type { MintButtonProps } from '../../../types/nft'
import styles from './MintButton.module.css'

export function MintButton({ formData, onSuccess }: MintButtonProps) {
  const { address: userAddress } = useAccount()
  const { mintNFT } = useMintNFT()

  const handleMint = async () => {
    const { title, description, imageFile, price } = formData
    if (!userAddress) return toast.error('Connect your wallet first')
    if (!title || !description || !imageFile || !price)
      return toast.error('Please fill in all fields')

    try {
      toast.loading('Uploading to IPFS...', { id: 'upload' })
      const imageCid = await uploadImageToIPFS(imageFile)
      const imageURI = `ipfs://${imageCid}`
      const metadataURI = await createAndUploadMetadata({
        name: title,
        description,
        imageURI,
      })
      toast.success('Files uploaded successfully', { id: 'upload' })

      toast.loading('Minting NFT...', { id: 'mint' })
      const hash = await mintNFT(userAddress, metadataURI, price)

      if (hash) {
        const gatewayLink = cidToGatewayUrl(metadataURI.replace('ipfs://', ''))
        console.log('Metadata Gateway URL:', gatewayLink)
        toast.success('NFT minted successfully!', { id: 'mint' })
        onSuccess?.(hash)
      }
    } catch (err) {
      console.error(err)
      toast.error('Mint failed — check console for details', { id: 'mint' })
    }
  }

  return (
    <button onClick={handleMint} className={styles.mintButton}>
      Mint NFT
    </button>
  )
}
