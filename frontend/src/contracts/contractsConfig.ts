import DnANFT from './DnANFT.json'
import DnAAuctionHouse from './DnAAuctionHouse.json'

export const contractsConfig = {
  DnANFT: {
    address: '0x206DcC9CE5Cd1D19AdeB0068B49237F7f8537D55',
    abi: DnANFT.abi,
  },
  DnAAuctionHouse: {
    address: '0x2c103C9507dA2Bd3A0b42D1023723C6bC8Bc812F',
    abi: DnAAuctionHouse.abi,
  },
} as const
