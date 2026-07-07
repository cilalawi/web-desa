'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type DBImage = { id: string; url: string; alt: string }

export function ImageUploadField({
  name,
  label,
  currentImage,
  currentImages = [],
}: {
  name: string
  label: string
  currentImage?: DBImage | null
  currentImages?: DBImage[]
}) {
  // Normalize both inputs into a single array
  const initialImages = currentImages.length
    ? currentImages
    : currentImage
    ? [currentImage]
    : []

  const [keptImages, setKeptImages] = useState<DBImage[]>(initialImages)
  const [previews, setPreviews] = useState<string[]>([])
  const [fileNames, setFileNames] = useState<string[]>([])

  useEffect(() => {
    const nextImages = currentImages.length
      ? currentImages
      : currentImage
      ? [currentImage]
      : []
    setKeptImages(nextImages)
  }, [currentImage, currentImages])

  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p))
    }
  }, [previews])

  const handleRemoveKeptImage = (id: string) => {
    setKeptImages((prev) => prev.filter((img) => img.id !== id))
  }

  return (
    <div className="grid gap-3">
      <Label htmlFor={name} className="font-semibold text-emerald-950">
        {label}
      </Label>

      {/* Kept image IDs passed to server action */}
      {keptImages.map((img) => (
        <input key={img.id} type="hidden" name="keptImageIds" value={img.id} />
      ))}

      {/* Existing Images */}
      {keptImages.length > 0 && (
        <div className="grid gap-2">
          <p className="text-xs font-semibold text-emerald-950/70">Gambar Saat Ini ({keptImages.length})</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {keptImages.map((img) => (
              <div
                key={img.id}
                className="group relative aspect-video overflow-hidden rounded-xl border border-emerald-900/10 bg-white shadow-sm"
              >
                <Image src={img.url} alt={img.alt} fill sizes="144px" className="object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => handleRemoveKeptImage(img.id)}
                    className="rounded-full bg-red-600 px-3 py-1 text-2xs font-bold text-white shadow hover:bg-red-700 hover:scale-105 active:scale-95 transition-all"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Previews */}
      {previews.length > 0 && (
        <div className="grid gap-2">
          <p className="text-xs font-semibold text-emerald-950/70">Gambar Baru Ditambahkan ({previews.length})</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {previews.map((src, i) => (
              <div
                key={i}
                className="relative aspect-video overflow-hidden rounded-xl border border-emerald-900/10 bg-neutral-50 shadow-sm"
              >
                <img src={src} alt="Preview baru" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* File Upload Field */}
      <div className="grid gap-3 rounded-2xl border border-emerald-900/10 bg-emerald-50/50 p-3">
        <div className="grid gap-2">
          <Input
            id={name}
            name={name}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={(event) => {
              const files = event.target.files
              previews.forEach((p) => URL.revokeObjectURL(p))

              if (!files || files.length === 0) {
                setPreviews([])
                setFileNames([])
                return
              }

              const fileArray = Array.from(files)
              const urls = fileArray.map((file) => URL.createObjectURL(file))
              const names = fileArray.map((file) => file.name)
              setPreviews(urls)
              setFileNames(names)
            }}
          />
          <p className="text-xs leading-5 text-emerald-950/60">
            {fileNames.length > 0
              ? `Dipilih: ${fileNames.join(', ')}`
              : 'Pilih satu atau beberapa foto. Format JPG, PNG, WebP, atau AVIF. Maksimal 5 MB per foto.'}
          </p>
        </div>
      </div>
    </div>
  )
}
