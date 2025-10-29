import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React from 'react'

const ShowCaseSection = () => {
  return (
    <div className='container mx-auto items-center justify-center md:px-0 px-5'>
        <div className='flex lg:flex-row flex-col items-center justify-center gap-20'>
            <Image src={"/rocketmodel/rokcettheme.jpeg"} alt='i' width={"1024"} height={"1024"} className='rounded-2xl w-full h-full' />

            <div className='flex flex-col gap-6'>
                <p className='font-semibold'>MAKE A SPIN</p>
                <h1 className='text-5xl font-bold'>Welcome to the best online casino: win your million in slots</h1>
                <p>Blast off into an intergalactic adventure with Space Rocket, where you can explore the cosmos and win big prizes among the stars.</p>
                <div>
                  <Button variant={"destructive"} size={"lg"}>Click for a Bonus</Button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ShowCaseSection