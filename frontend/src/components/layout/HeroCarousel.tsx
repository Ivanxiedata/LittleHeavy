"use client"

import * as React from "react"
import Image from "next/image"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"

const BANNERS = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1516724562728-afc824a36e84?q=80&w=1600&auto=format&fit=crop",
    title: "Winter Sale",
    description: "Cozy up with our latest 3D cards. Buy 5 for $30.",
    cta: "Shop Winter"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=1600&auto=format&fit=crop",
    title: "Valentine's Day",
    description: "Make their heart pop with a unique surprise.",
    cta: "Shop Valentine's"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1600&auto=format&fit=crop",
    title: "Birthday Collection",
    description: "Celebrate another year of magic.",
    cta: "Shop Birthdays"
  }
]

export function HeroCarousel() {
  return (
    <Carousel className="w-full" opts={{ loop: true }}>
      <CarouselContent>
        {BANNERS.map((banner) => (
          <CarouselItem key={banner.id}>
            <div className="relative h-[500px] w-full">
               <Image 
                 src={banner.image} 
                 alt={banner.title} 
                 fill 
                 className="object-cover"
                 priority={banner.id === 1}
               />
               <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center text-white p-4 text-center">
                 <h2 className="text-5xl font-bold mb-4 drop-shadow-md">{banner.title}</h2>
                 <p className="text-xl mb-8 font-medium drop-shadow-md max-w-lg">{banner.description}</p>
                 <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white border-none px-8 py-6 text-lg rounded-full">
                   {banner.cta}
                 </Button>
               </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-4 bg-white/80 hover:bg-white text-black border-none" />
      <CarouselNext className="right-4 bg-white/80 hover:bg-white text-black border-none" />
    </Carousel>
  )
}
