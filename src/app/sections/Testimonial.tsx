import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React from 'react'

const Testimonial = () => {
  return (
    <div className='mt-20'>
        <div className='relative h-[40vh] min-h-[350px] max-h-[500px] flex items-center overflow-hidden'>
            <div className='absolute inset-0 z-0'>
                <Image src={"/herobgimage.jpg"} alt='i' width={"2048"} height={"2048"} className='object-cover' priority />
            </div>

            <div className='relative z-10 px-6'>
                <p className='font-semibold'>BECOME THE WINNER!</p>
                <h1 className='text-6xl font-semibold'>Get 100 free spins when you deposit $25</h1>
                <Button variant={"destructive"}>Play Now</Button>
            </div>
        </div>

        <div className='mt-20 flex flex-col items-center justify-center'>
            <p className='font-semibold'>TESTIMONIALS</p>
            <h1 className='text-4xl font-semibold'>Winners Feedback</h1>
        </div>
    </div>
  )
}

export default Testimonial