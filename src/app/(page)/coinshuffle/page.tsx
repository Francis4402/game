import React from 'react'
import CoinShuffleGame from '../utils/games/CoinShuffle'
import { userData } from '@/authserver/users';

const CoinShuffle = async () => {

  const session = await userData();

  return (
    <div>
        <CoinShuffleGame session={session} />
    </div>
  )
}

export default CoinShuffle