import DnANFT from './DnANFT.json'
import DnAAuctionHouse from './DnAAuctionHouse.json'

export const contractsConfig = {
  DnANFT: {
    address: '0x1F5861DCE2215580127d4CAe8B3271C0E058e0c4',
    abi: DnANFT.abi,
  },
  DnAAuctionHouse: {
    address: '0xAAC56346ec8fcA55385A235574F6C142DDeE4542',
    abi: DnAAuctionHouse.abi,
  },
} as const
