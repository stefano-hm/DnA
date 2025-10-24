import { useEffect, useState } from 'react'
import { useReadContract, useWatchContractEvent } from 'wagmi'
import { MintButton } from '../../components/MintButton/MintButton'
import { contractsConfig } from '../../contracts/contractsConfig'
import styles from './Store.module.css'

type NFTItem = {
  tokenId: number
  image: string
  owner: string
  price: string
}

export default function Store() {
  const { address: contractAddress, abi } = contractsConfig.DnANFT
  const [nfts, setNfts] = useState<NFTItem[]>([])

  const { data, isLoading, error, refetch } = useReadContract({
    address: contractAddress,
    abi,
    functionName: 'getAllNFTs',
  })

  useEffect(() => {
    if (!data || !Array.isArray(data)) return

    const [ids, owners, uris, prices] = data as [
      bigint[],
      string[],
      string[],
      bigint[],
    ]

    const formatted = ids.map((id, i) => ({
      tokenId: Number(id),
      image: uris[i].startsWith('ipfs://')
        ? uris[i].replace('ipfs://', 'https://ipfs.io/ipfs/')
        : uris[i],
      owner: owners[i],
      price: (Number(prices[i]) / 1e18).toFixed(3),
    }))

    setNfts(formatted)
  }, [data])

  useWatchContractEvent({
    address: contractAddress,
    abi,
    eventName: 'Minted',
    onLogs(logs) {
      console.log('New mint event detected:', logs)
      refetch()
    },
  })

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>DnA NFT Store</h2>

      <div className={styles.mintSection}>
        <MintButton />
      </div>

      {isLoading && <p>Loading NFTs from blockchain...</p>}
      {error && <p className={styles.error}>Error loading NFTs.</p>}

      <div className={styles.grid}>
        {nfts.length === 0 && !isLoading && <p>No NFTs found.</p>}

        {nfts.map(nft => (
          <div key={nft.tokenId} className={styles.card}>
            <img
              src={nft.image}
              alt={`NFT ${nft.tokenId}`}
              className={styles.image}
            />
            <h3 className={styles.cardTitle}>Token #{nft.tokenId}</h3>
            <p className={styles.price}>{nft.price} ETH</p>
            <p className={styles.owner}>
              Owner: {nft.owner.slice(0, 6)}...{nft.owner.slice(-4)}
            </p>
            <button className={styles.buyButton}>Buy Now</button>
          </div>
        ))}
      </div>
    </div>
  )
}
