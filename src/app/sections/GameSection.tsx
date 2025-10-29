import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const GameSection = () => {
  return (
    <div className="grid grid-cols-2">
        <Link href={"/rocket"} className='rounded-2xl overflow-hidden w-fit'>
            <Image src={"/rocketmodel/rokcettheme.jpeg"} alt="i" width={"300"} height={"300"} />
        </Link>
    </div>
  )
}

export default GameSection