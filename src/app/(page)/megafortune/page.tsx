import React from 'react'
import SlotMachineGame from '../utils/games/MegaForune'
import { userData } from '@/authserver/users';

const MegaFortune = async () => {

  const session = await userData();

  return (
    <div>
      <SlotMachineGame session={session} />
    </div>
  )
}

export default MegaFortune