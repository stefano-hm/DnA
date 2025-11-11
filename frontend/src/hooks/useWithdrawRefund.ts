import toast from 'react-hot-toast'
import { useWriteContract } from 'wagmi'
import { waitForTransactionReceipt, readContract } from '@wagmi/core'
import { wagmiConfig } from '../wagmiConfig'
import { contractsConfig } from '../contracts/contractsConfig'

export function useWithdrawRefund(onWithdrawn?: (id: number) => void) {
  const { writeContractAsync } = useWriteContract()
  const { address: auctionAddress, abi } = contractsConfig.DnAAuctionHouse

  const withdrawRefund = async (
    auctionId: number,
    userAddress: string,
    refetch: () => Promise<any>
  ) => {
    try {
      toast.dismiss('withdrawTx')
      toast.loading(`Withdrawing refund from auction #${auctionId}...`, {
        id: 'withdrawTx',
      })

      const hash = await writeContractAsync({
        address: auctionAddress,
        abi,
        functionName: 'withdraw',
        args: [BigInt(auctionId)],
      })

      await waitForTransactionReceipt(wagmiConfig, { hash })

      await new Promise(res => setTimeout(res, 3000))
      await refetch()

      const newAmount = (await readContract(wagmiConfig, {
        address: auctionAddress,
        abi,
        functionName: 'pendingReturns',
        args: [BigInt(auctionId), userAddress as `0x${string}`],
      })) as bigint

      if (newAmount === 0n) {
        toast.success(
          `Refund successfully withdrawn from auction #${auctionId}!`,
          { id: 'withdrawTx' }
        )
        onWithdrawn?.(auctionId)
      } else {
        toast.error(
          'Withdraw confirmed, but funds still pending. Try again later.',
          { id: 'withdrawTx' }
        )
      }
    } catch (err: any) {
      console.error(err)
      toast.dismiss('withdrawTx')

      const raw = err?.message || ''
      let msg = 'Withdraw failed. Please try again.'
      if (raw.includes('ACTION_REJECTED')) msg = 'Transaction rejected by user.'
      else if (raw.includes('insufficient funds'))
        msg = 'Insufficient funds for gas or transaction.'
      else if (raw.includes('execution reverted'))
        msg =
          'Withdraw failed — possible contract restriction or already withdrawn.'
      else if (raw.includes('timeout') || raw.includes('network error'))
        msg = 'Network issue or RPC timeout.'

      toast.error(msg, { id: 'withdrawTx' })
    }
  }

  return { withdrawRefund }
}
