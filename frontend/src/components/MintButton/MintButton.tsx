import { useState } from 'react'
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from 'wagmi'
import toast from 'react-hot-toast'
import { contractsConfig } from '../../contracts/contractsConfig'
import styles from './MintButton.module.css'

export function MintButton() {
  const { address: contractAddress, abi } = contractsConfig.DnANFT
  const { address: userAddress } = useAccount()
  const [txHash, setTxHash] = useState<string | null>(null)

  const { writeContract, data, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: data,
  })

  const handleMint = async () => {
    if (!userAddress) {
      toast.error('Connect your wallet first')
      return
    }

    try {
      const tokenId = Date.now() // esempio semplice di ID univoco
      const uri = 'ipfs://your-nft-metadata-link' // sostituisci con un URI reale di metadati IPFS

      writeContract(
        {
          address: contractAddress,
          abi,
          functionName: 'mintTo',
          args: [userAddress, tokenId, uri],
        },
        {
          onSuccess: hash => {
            setTxHash(hash)
            toast.loading('Minting in progress...', { id: 'mint' })
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
