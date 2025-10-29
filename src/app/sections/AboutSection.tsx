import { ArrowBigDown, ArrowRight, CardSim } from 'lucide-react'
import React from 'react'

const AboutSection = () => {

    const games = [
        {
          icons: <ArrowBigDown />,
          title: 'Slots',
          description: 'Experience the thrill of spinning reels with our diverse selection of slot games, featuring captivating themes and exciting bonus rounds.'
        },
        {
          icons: <ArrowBigDown />,
          title: 'Space Rocket',
          description: 'Blast off into an intergalactic adventure with Space Rocket, where you can explore the cosmos and win big prizes among the stars.'
        },
        {
          icons: <CardSim />,
          title: 'Tiwsted Table',
          description: 'Challenge your skills and luck at our Twisted Table games, offering unique twists on classic casino favorites for an unforgettable gaming experience.'
        }
    ]

  return (
    <div className='container mx-auto max-w-5xl'>
        <h1 className='text-8xl font-bold text-center tracking-wide'>You can enjoy your favorite slot games with us</h1>
        <div className='grid grid-cols-3 gap-6'>
            {
                games.map((game, index) => (
                    <div key={index} className='mt-20 flex flex-col items-start gap-6'>
                        <div className='text-6xl text-primary'>{game.icons}</div>
                        <div>
                            <h2 className='text-4xl font-semibold'>{game.title}</h2>
                            <p className='text-lg text-muted-foreground'>{game.description}</p>
                        </div>
                        <ArrowRight />
                    </div>
                ))
            }
        </div>
    </div>
  )
}

export default AboutSection