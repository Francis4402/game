import React from 'react'
import RouletteGame from '../utils/games/Roulette'
import { userData } from '@/authserver/users';

const Roulette = async () => {

  const session = await userData();

  return (
    <div>
      <RouletteGame />
    </div>
  )
}

export default Roulette