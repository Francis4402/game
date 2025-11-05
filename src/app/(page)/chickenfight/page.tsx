import React from 'react'
import ChickenFightGame from '../utils/games/ChickenFight'
import { userData } from '@/authserver/users';

const ChickenFight = async () => {

  const session = await userData();

  return (
    <div>
        <ChickenFightGame session={session} />
    </div>
  )
}

export default ChickenFight