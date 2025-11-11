import toast from 'react-hot-toast'
import { useWriteContract } from 'wagmi'
import { waitForTransactionReceipt, readContract } from '@wagmi/core'
import { contractsConfig } from '../contracts/contractsConfig'
import { wagmiConfig } from '../wagmiConfig'
import type { AuctionStruct } from '../types/auction'

export function useClaimNFT(onClaimed?: (id: number) => void) {
  const { writeContractAsync } = useWriteContract()
  const { address: auctionAddress, abi } = contractsConfig.DnAAuctionHouse

  const claimNFT = async (auctionId: number, auctionData?: AuctionStruct) => {
    const nftAddress = auctionData?.nft
    const tokenId = auctionData?.tokenId

    try {
      toast.dismiss('claimTx')
      toast.loading(`Claiming NFT from auction #${auctionId}...`, {
        id: 'claimTx',
      })

      const hash = await writeContractAsync({
        address: auctionAddress,
        abi,
        functionName: 'claim',
        args: [BigInt(auctionId)],
      })

      await waitForTransactionReceipt(wagmiConfig, { hash })

      await new Promise(res => setTimeout(res, 4000))

      if (!nftAddress || tokenId === undefined) {
        toast.success(`NFT from auction #${auctionId} successfully claimed!`, {
          id: 'claimTx',
        })
        onClaimed?.(auctionId)
        return
      }

      const newOwner = (await readContract(wagmiConfig, {
        address: nftAddress as `0x${string}`,
        abi: contractsConfig.DnANFT.abi,
        functionName: 'ownerOf',
        args: [tokenId],
      })) as string

      const nftClaimed =
        !!newOwner && newOwner.toLowerCase() !== auctionAddress.toLowerCase()

      if (nftClaimed) {
        toast.success(`NFT from auction #${auctionId} successfully claimed!`, {
          id: 'claimTx',
        })
        onClaimed?.(auctionId)
      } else {
        toast.error(
          'Claim transaction confirmed, but NFT owner not updated yet. Try again shortly.',
          { id: 'claimTx' }
        )
      }
    } catch (err: any) {
      console.error(err)
      toast.dismiss('claimTx')

      const raw = err?.message || ''
      let msg = 'Failed to claim NFT. Please try again.'
      if (raw.includes('ACTION_REJECTED')) msg = 'Transaction rejected by user.'
      else if (raw.includes('insufficient funds'))
        msg = 'Insufficient funds for gas or transaction.'
      else if (raw.includes('execution reverted'))
        msg = 'The claim could not be processed. Try again later.'
      else if (raw.includes('timeout') || raw.includes('network error'))
        msg = 'Network issue or RPC timeout.'

      toast.error(msg, { id: 'claimTx' })
    }
  }

  return { claimNFT }
}
