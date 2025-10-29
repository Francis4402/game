
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const GameFeatures = () => {

  const featuredGames = [
    {
      image: "/rocketmodel/rokcettheme.jpeg",
      name: "Space Rocket",
      link: "/rocket"
    },
    {
      image: "/rocketmodel/rokcettheme.jpeg",
      name: "Space Rocket",
      link: "/rocket"
    },
    {
      image: "/rocketmodel/rokcettheme.jpeg",
      name: "Space Rocket",
      link: "/rocket"
    },
  ]
  
  return (
    <div className='flex flex-col gap-2 items-center justify-center'>
      <p>FOR YOU</p>
      <h1 className='text-4xl font-semibold'>Featured games</h1>

      <div className='grid grid-cols-3 gap-10 my-10'>
        {
          featuredGames.map((g, index) => (
            <div key={index} className='border-b-2 rounded-2xl flex flex-col gap-2'>
              <Image src={g.image} alt='i' width={"1024"} height={"1024"} className='rounded-2xl' />
              <div className='p-4 flex items-center justify-between'>
                <p className='text-2xl font-bold'>{g.name}</p>
                <Link href={g.link}>
                  <Button variant={"outline"}><ArrowRight /></Button>
                </Link>
              </div>
            </div>
          ))
        }
      </div>

      <Button size={"lg"} variant={"destructive"}>Get Started</Button>
    </div>
  )
}

export default GameFeatures