import DnANFT from './DnANFT.json'
import DnAAuctionHouse from './DnAAuctionHouse.json'

export const contractsConfig = {
  DnANFT: {
    address: '0xB4F72d12E5D03A58671EE3bCE3643432B13f08A0',
    abi: DnANFT.abi,
  },
  DnAAuctionHouse: {
    address: '0xAD8812fcEe52183A01e248bD4307A6762c1C3F7a',
    abi: DnAAuctionHouse.abi,
  },
} as const
