import DnANFT from './DnANFT.json'
import DnAAuctionHouse from './DnAAuctionHouse.json'

export const contractsConfig = {
  DnANFT: {
    address: '0x4F15C392e73c609b098C64Ab82567330ff8df01A',
    abi: DnANFT.abi,
  },
  DnAAuctionHouse: {
    address: '0xd9cad9e49BA3162E5e497cC9b08AD8aaE7322895',
    abi: DnAAuctionHouse.abi,
  },
} as const
