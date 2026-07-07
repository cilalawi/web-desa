'use client'

import Image from 'next/image'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

type ImageItem = {
  url: string
  alt: string
}

export function ImageCarousel({
  images,
  className = "aspect-video w-full",
  imgClassName = "object-cover",
  sizes = "(max-width: 768px) 100vw, 640px",
}: {
  images: ImageItem[]
  className?: string
  imgClassName?: string
  sizes?: string
}) {
  const [index, setIndex] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className={`relative overflow-hidden bg-neutral-100 ${className}`}>
        <div className="grid h-full place-items-center text-xs font-medium text-emerald-950/45">
          Tidak ada gambar
        </div>
      </div>
    )
  }

  if (images.length === 1) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image
          src={images[0].url}
          alt={images[0].alt}
          fill
          sizes={sizes}
          className={imgClassName}
        />
      </div>
    )
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className={`group relative overflow-hidden ${className}`}>
      {/* Slide Container */}
      <div className="relative h-full w-full">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 h-full w-full"
          >
            <Image
              src={images[index].url}
              alt={images[index].alt}
              fill
              sizes={sizes}
              className={imgClassName}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <button
        type="button"
        onClick={handlePrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex size-8 items-center justify-center rounded-full bg-white/95 text-emerald-950 shadow-md ring-1 ring-emerald-900/5 backdrop-blur transition-all opacity-0 group-hover:opacity-100 hover:bg-white hover:scale-105 active:scale-95 max-md:opacity-100"
        aria-label="Sebelumnya"
      >
        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        type="button"
        onClick={handleNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex size-8 items-center justify-center rounded-full bg-white/95 text-emerald-950 shadow-md ring-1 ring-emerald-900/5 backdrop-blur transition-all opacity-0 group-hover:opacity-100 hover:bg-white hover:scale-105 active:scale-95 max-md:opacity-100"
        aria-label="Berikutnya"
      >
        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Indicators / Dots */}
      <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 z-20">
        {images.map((_, i) => (
          <button
            type="button"
            key={i}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIndex(i)
            }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? 'w-4 bg-white shadow-sm' : 'w-1.5 bg-white/60 hover:bg-white/85'
            }`}
            aria-label={`Ke slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
