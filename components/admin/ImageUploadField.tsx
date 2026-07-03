'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type CurrentImage = { url: string; alt: string } | null | undefined

export function ImageUploadField({ name, label, currentImage }: { name: string; label: string; currentImage?: CurrentImage }) {
  const [preview, setPreview] = useState<string | null>(null)
  const [fileName, setFileName] = useState('')

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  return (
    <div className="grid gap-2">
      <Label htmlFor={name}>{label}</Label>
      <div className="grid gap-3 rounded-2xl border border-emerald-900/10 bg-emerald-50/50 p-3 sm:grid-cols-[9rem_1fr] sm:items-center">
        <div className="relative aspect-video overflow-hidden rounded-xl bg-white ring-1 ring-emerald-900/10 sm:aspect-square">
          {preview ? (
            <img src={preview} alt="Preview gambar yang dipilih" className="h-full w-full object-cover" />
          ) : currentImage ? (
            <Image src={currentImage.url} alt={currentImage.alt} fill sizes="144px" className="object-cover" />
          ) : (
            <div className="grid h-full place-items-center px-4 text-center text-xs font-medium text-emerald-950/55">
              Belum ada gambar
            </div>
          )}
        </div>
        <div className="grid gap-2">
          <Input
            id={name}
            name={name}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (preview) URL.revokeObjectURL(preview)
              if (!file) {
                setPreview(null)
                setFileName('')
                return
              }
              setPreview(URL.createObjectURL(file))
              setFileName(file.name)
            }}
          />
          <p className="text-xs leading-5 text-emerald-950/60">
            {fileName ? `Dipilih: ${fileName}` : currentImage ? 'Gambar saat ini akan tetap dipakai jika tidak memilih file baru.' : 'Opsional. Format JPG, PNG, WebP, atau AVIF. Maksimal 5 MB.'}
          </p>
        </div>
      </div>
    </div>
  )
}
