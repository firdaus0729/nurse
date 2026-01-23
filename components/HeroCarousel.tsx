'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from './ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CarouselSlide {
  id: string
  title: string
  subtitle: string | null
  imageUrl: string | null
  ctaText: string | null
  ctaLink: string | null
  isActive: boolean
  order: number
}

interface HeroCarouselProps {
  slides: CarouselSlide[]
}

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  // Only show first 3 active slides, sorted by order
  const activeSlides = slides
    .filter(slide => slide.isActive)
    .sort((a, b) => a.order - b.order)
    .slice(0, 3)

  useEffect(() => {
    if (activeSlides.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeSlides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [activeSlides.length])

  if (activeSlides.length === 0) {
    return null
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeSlides.length)
  }

  const currentSlide = activeSlides[currentIndex]

  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
      {activeSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {slide.imageUrl && (
            <Image
              src={slide.imageUrl}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
          )}
          {/* Subtle overlay for text readability, not full green background */}
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none">
            <div className="text-center text-white px-4 max-w-3xl z-10 pointer-events-auto">
              <h1 className="text-3xl md:text-5xl font-bold mb-6 drop-shadow-lg">
                {slide.title}
              </h1>
              {slide.subtitle && (
                <p className="text-lg md:text-xl mb-6 drop-shadow-md">{slide.subtitle}</p>
              )}
              {slide.ctaText && slide.ctaLink && (
                <Link href={slide.ctaLink} className="inline-block">
                  <Button size="lg" variant="default" className="bg-white text-primary hover:bg-white/90 shadow-lg text-base md:text-lg px-8 py-6">
                    {slide.ctaText}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}

      {activeSlides.length > 1 && (
        <>
          <button
            type="button"
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-primary/80 hover:bg-primary text-white p-2 rounded-full transition-colors shadow-lg backdrop-blur-sm z-20"
            aria-label="Slide anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary/80 hover:bg-primary text-white p-2 rounded-full transition-colors shadow-lg backdrop-blur-sm z-20"
            aria-label="Slide siguiente"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {activeSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-8 bg-white'
                    : 'w-2 bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Ir al slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

