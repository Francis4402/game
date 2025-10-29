import Image from 'next/image'
import React from 'react'
import { Button } from '@/components/ui/button'

const HeroSection = () => {
  return (
    <section className="relative h-[50vh] min-h-[350px] max-h-[500px] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/herobgimage.jpg"
          alt="Hero background"
          fill
          className="object-cover rounded-b-2xl lg:rounded-b-3xl"
          priority
        />
        <div className="absolute inset-0 bg-black/40 rounded-b-2xl lg:rounded-b-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
          Welcome to
          <span className="block text-blue-400">Our World</span>
        </h1>
        
        <p className="text-base md:text-lg text-gray-200 mb-6 max-w-xl mx-auto">
          Creating amazing experiences with modern technology.
        </p>

        <Button 
          size="lg" 
          className="bg-white text-gray-900 hover:bg-gray-100 rounded-lg px-6 py-3 font-semibold"
        >
          Get Started
        </Button>
      </div>
    </section>
  )
}

export default HeroSection