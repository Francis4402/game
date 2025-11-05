import React from 'react'
import DivineFortuneGame from '../utils/games/DevinFortune'
import { userData } from '@/authserver/users';

const DivineFortune = async () => {

  const session = await userData();

  return (
    <div>
      <DivineFortuneGame session={session} />
    </div>
  )
}

export default DivineFortune