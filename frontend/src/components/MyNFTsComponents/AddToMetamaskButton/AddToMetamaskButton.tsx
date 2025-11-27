import { useState, useEffect } from 'react'
import { useAddToMetamask } from '../../../hooks/useAddToMetamask'
import type { AddToMetamaskButtonProps } from '../../../types/nft'
import styles from './AddToMetamaskButton.module.css'

export function AddToMetamaskButton({
  nftAddress,
  tokenId,
  image,
}: AddToMetamaskButtonProps) {
  const [added, setAdded] = useState(false)
  const { addToMetamask } = useAddToMetamask(() => {
    setAdded(true)
    localStorage.setItem(`addedToMetaMask_${tokenId}`, 'true')
  })

  useEffect(() => {
    const stored = localStorage.getItem(`addedToMetaMask_${tokenId}`)
    if (stored === 'true') {
      setAdded(true)
    }
  }, [tokenId])

  const handleClick = async () => {
    const ok = await addToMetamask(nftAddress, tokenId, image)
    if (ok) {
      setAdded(true)
      localStorage.setItem(`addedToMetaMask_${tokenId}`, 'true')
    }
  }

  if (added) return null

  return (
    <button onClick={handleClick} className={styles.addButton}>
      Add to MetaMask
    </button>
  )
}
