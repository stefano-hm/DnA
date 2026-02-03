import { useEffect, useState } from 'react'
import { useReadContract } from 'wagmi'
import { contractsConfig } from '../../../contracts/contractsConfig'
import { useWithdrawRefund } from '../../../hooks/useWithdrawRefund'
import type { WithdrawButtonProps } from '../../../types/auction'
import styles from './WithdrawButton.module.css'

export function WithdrawButton({
  auctionId,
  userAddress,
  onWithdrawn,
}: WithdrawButtonProps) {
  const { address: auctionAddress, abi } = contractsConfig.DnAAuctionHouse
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [pendingAmount, setPendingAmount] = useState<bigint>(0n)

  const { withdrawRefund } = useWithdrawRefund(id => {
    onWithdrawn?.(id)
  })

  const { data: amountData, refetch } = useReadContract({
    address: auctionAddress,
    abi,
    functionName: 'pendingReturns',
    args: userAddress
      ? [BigInt(auctionId), userAddress as `0x${string}`]
      : undefined,
    query: { enabled: !!userAddress },
  })

  useEffect(() => {
    if (typeof amountData === 'bigint') {
      setPendingAmount(amountData)
    }
  }, [amountData])

  const handleWithdraw = async () => {
    if (!userAddress) return
    setIsWithdrawing(true)
    await withdrawRefund(auctionId, userAddress, refetch)
    setIsWithdrawing(false)
  }

  if (!userAddress || pendingAmount === 0n) return null

  return (
    <button
      onClick={handleWithdraw}
      className={styles.withdrawButton}
      disabled={isWithdrawing}
    >
      {isWithdrawing ? 'Withdrawing...' : 'Withdraw Refund'}
    </button>
  )
}
