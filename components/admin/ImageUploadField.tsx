'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { Label } from '@/components/ui/label'

type DBImage = { id: string; url: string; alt: string }

// Subcomponent to bind File objects to hidden DOM inputs for form submission
function HiddenFileInput({ name, file }: { name: string; file: File }) {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (ref.current) {
      const dt = new DataTransfer()
      dt.items.add(file)
      ref.current.files = dt.files
    }
  }, [file])

  return <input ref={ref} type="file" name={name} className="hidden" readOnly />
}

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
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Normalize existing database images into a single array
  const initialImages = currentImages.length
    ? currentImages
    : currentImage
    ? [currentImage]
    : []

  const [keptImages, setKeptImages] = useState<DBImage[]>(initialImages)
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<{ url: string; name: string }[]>([])
  const [isDragActive, setIsDragActive] = useState(false)

  // Sync existing images from props
  useEffect(() => {
    const nextImages = currentImages.length
      ? currentImages
      : currentImage
      ? [currentImage]
      : []
    setKeptImages(nextImages)
  }, [currentImage, currentImages])

  // Generate previews and clean up Object URLs automatically
  useEffect(() => {
    const urls = newFiles.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
    }))
    setPreviews(urls)

    return () => {
      urls.forEach((p) => URL.revokeObjectURL(p.url))
    }
  }, [newFiles])

  const handleRemoveKeptImage = (id: string) => {
    setKeptImages((prev) => prev.filter((img) => img.id !== id))
  }

  const handleRemoveNewFile = (idx: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== idx))
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleFilesAdded = (files: FileList | null) => {
    if (!files || files.length === 0) return
    const fileArray = Array.from(files)
    setNewFiles((prev) => [...prev, ...fileArray])

    // Clear value of the triggers file input so selecting the same file again still fires onChange
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true)
    } else if (e.type === 'dragleave') {
      setIsDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesAdded(e.dataTransfer.files)
    }
  }

  return (
    <div className="grid gap-3">
      <Label htmlFor={name} className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-emerald-900/80">
        {label}
      </Label>

      {/* Hidden inputs to send kept image IDs to Server Action */}
      {keptImages.map((img) => (
        <input key={img.id} type="hidden" name="keptImageIds" value={img.id} />
      ))}

      {/* Hidden input elements dynamically generated for each selected file */}
      {newFiles.map((file, idx) => (
        <HiddenFileInput key={idx} name={name} file={file} />
      ))}

      {/* Hidden native file input used only to trigger file selection dialog */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={(e) => handleFilesAdded(e.target.files)}
      />

      {/* Image Gallery Previews Grid */}
      {(keptImages.length > 0 || previews.length > 0) && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {/* Existing Database Images */}
          {keptImages.map((img) => (
            <div
              key={img.id}
              className="group relative aspect-video overflow-hidden rounded-2xl border border-emerald-900/10 bg-white p-1 shadow-sm transition-all hover:border-emerald-700/20 hover:shadow-md"
            >
              <div className="relative h-full w-full overflow-hidden rounded-xl">
                <Image src={img.url} alt={img.alt} fill sizes="160px" className="object-cover" />
              </div>
              <span className="absolute top-3 left-3 bg-emerald-700/90 backdrop-blur text-[0.55rem] font-black text-white px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm select-none">
                Tersimpan
              </span>
              <div className="absolute inset-0 flex items-center justify-center bg-emerald-950/40 opacity-0 backdrop-blur-[1px] transition-all duration-200 group-hover:opacity-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => handleRemoveKeptImage(img.id)}
                  className="flex size-9 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
                  title="Hapus foto ini"
                >
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}

          {/* New Pending Images */}
          {previews.map((preview, i) => (
            <div
              key={i}
              className="group relative aspect-video overflow-hidden rounded-2xl border border-emerald-900/10 bg-white p-1 shadow-sm transition-all hover:border-emerald-700/20 hover:shadow-md"
            >
              <div className="relative h-full w-full overflow-hidden rounded-xl bg-neutral-50">
                <img src={preview.url} alt={preview.name} className="h-full w-full object-cover" />
              </div>
              <span className="absolute top-3 left-3 bg-lime-600/95 backdrop-blur text-[0.55rem] font-black text-white px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm select-none">
                Baru
              </span>
              <div className="absolute inset-0 flex items-center justify-center bg-emerald-950/40 opacity-0 backdrop-blur-[1px] transition-all duration-200 group-hover:opacity-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => handleRemoveNewFile(i)}
                  className="flex size-9 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
                  title="Batalkan foto ini"
                >
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Interactive Custom Dropzone */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        className={`group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-200 cursor-pointer ${
          isDragActive
            ? 'border-emerald-700 bg-emerald-50/70 scale-[0.99] shadow-inner'
            : 'border-emerald-900/15 bg-emerald-50/20 hover:border-emerald-700/60 hover:bg-emerald-50/40'
        }`}
      >
        <div className="flex size-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-800 ring-4 ring-emerald-500/5 transition-transform group-hover:scale-105">
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        <p className="mt-3 text-xs font-bold text-emerald-950">
          Tarik & lepas atau <span className="text-emerald-700 hover:underline">klik untuk memilih foto</span>
        </p>

        <p className="mt-1 text-[0.62rem] leading-4 text-emerald-950/50">
          Format JPG, PNG, WebP, atau AVIF (maksimal 5 MB per foto).
        </p>

        {newFiles.length > 0 && (
          <p className="mt-2 rounded bg-white px-2 py-0.5 text-[0.62rem] font-medium text-emerald-900 border border-emerald-900/5 max-w-xs truncate shadow-sm">
            Total Baru: {newFiles.length} foto terpilih
          </p>
        )}
      </div>
    </div>
  )
}
