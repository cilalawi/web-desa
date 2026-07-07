import { del, put } from '@vercel/blob'
import { MediaPurpose } from '@/app/generated/prisma/client'
import { prisma } from '@/lib/prisma'

const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const IMAGE_TYPES = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/avif', 'avif'],
])

function safeSegment(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'media'
}

export function optionalImageFile(fd: FormData, key: string) {
  const value = fd.get(key)
  if (value instanceof File && value.size > 0) return value
  return null
}

export function multipleImageFiles(fd: FormData, key: string) {
  const values = fd.getAll(key)
  return values.filter((value): value is File => value instanceof File && value.size > 0)
}

export async function uploadImageAsset(
  file: File,
  {
    alt,
    folder,
    purpose,
    name,
  }: {
    alt: string
    folder: string
    purpose: MediaPurpose
    name: string
  }
) {
  const extension = IMAGE_TYPES.get(file.type)
  if (!extension) throw new Error('Format gambar harus JPG, PNG, WebP, atau AVIF.')
  if (file.size > MAX_IMAGE_SIZE) throw new Error('Ukuran gambar maksimal 5 MB.')

  const pathname = `${safeSegment(folder)}/${safeSegment(name)}.${extension}`
  const blob = await put(pathname, file, {
    access: 'public',
    addRandomSuffix: true,
  })

  return prisma.mediaAsset.create({
    data: {
      url: blob.url,
      alt,
      storageKey: blob.pathname ?? pathname,
      mimeType: file.type,
      size: file.size,
      purpose,
    },
  })
}

export async function deleteMediaAsset(assetId: string | null | undefined) {
  if (!assetId) return
  const asset = await prisma.mediaAsset.findUnique({ where: { id: assetId } })
  if (!asset) return

  await prisma.mediaAsset.delete({ where: { id: asset.id } })

  try {
    await del(asset.url)
  } catch {
    // Blob cleanup should not block deleting or replacing website content.
  }
}
