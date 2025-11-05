import React from 'react'
import RocketCrashGame from '../utils/games/SpaceRocket'
import { userData } from '@/authserver/users';

const SpaceRocket = async () => {

    const session = await userData();

  return (
    <div>
        <RocketCrashGame />
    </div>
  )
}

export default SpaceRocket