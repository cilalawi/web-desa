'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { ContentStatus, MediaPurpose } from '@/app/generated/prisma/client'
import { requireAdmin } from '@/lib/admin-auth'
import { deleteMediaAsset, optionalImageFile, uploadImageAsset, multipleImageFiles } from '@/lib/media-upload'
import { prisma } from '@/lib/prisma'
import { buildUniqueSlug } from '@/lib/slug'

// ponytail: one actions file covers all admin CRUD; split per-module when >300 LOC

function str(fd: FormData, key: string, label: string) {
  const v = fd.get(key)
  if (typeof v !== 'string' || !v.trim()) throw new Error(`${label} wajib diisi.`)
  return v.trim()
}

function optStr(fd: FormData, key: string) {
  const v = fd.get(key)
  return typeof v === 'string' && v.trim() ? v.trim() : null
}

function status(fd: FormData): ContentStatus {
  const v = fd.get('status')
  if (v === 'PUBLISHED' || v === 'DRAFT' || v === 'ARCHIVED') return v
  return 'DRAFT'
}

async function uploadOptionalImage(
  fd: FormData,
  key: string,
  options: { purpose: MediaPurpose; folder: string; name: string; alt: string }
) {
  const file = optionalImageFile(fd, key)
  if (!file) return null
  return uploadImageAsset(file, options)
}

async function uploadMultipleImages(
  fd: FormData,
  key: string,
  options: { purpose: MediaPurpose; folder: string; name: string; alt: string }
) {
  const files = multipleImageFiles(fd, key)
  if (!files || files.length === 0) return []
  const assets = []
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const asset = await uploadImageAsset(file, {
      ...options,
      alt: `${options.alt} ${i + 1}`,
    })
    assets.push(asset)
  }
  return assets
}

// ── News ──

export async function upsertNews(fd: FormData) {
  await requireAdmin()
  const id = optStr(fd, 'id')
  const title = str(fd, 'title', 'Judul')
  const excerpt = str(fd, 'excerpt', 'Ringkasan')
  const body = str(fd, 'body', 'Isi berita')
  const s = status(fd)
  const keptImageIds = fd.getAll('keptImageIds') as string[]
  const existing = id ? await prisma.news.findUnique({ where: { id }, select: { coverAssetId: true, coverAssetIds: true } }) : null
  const newAssets = await uploadMultipleImages(fd, 'coverImage', {
    purpose: MediaPurpose.COVER,
    folder: 'berita',
    name: title,
    alt: `Gambar sampul berita ${title}`,
  })
  const newAssetIds = newAssets.map((asset) => asset.id)
  const coverAssetIds = [...keptImageIds, ...newAssetIds]
  const coverAssetId = coverAssetIds[0] || null

  const existingSlugs = await prisma.news.findMany({
    where: id ? { NOT: { id } } : undefined,
    select: { slug: true },
  })
  const data = {
    title,
    slug: buildUniqueSlug(title, existingSlugs.map((item) => item.slug)),
    excerpt,
    body,
    status: s,
    publishedAt: s === 'PUBLISHED' ? new Date() : null,
    coverAssetId,
    coverAssetIds,
  }
  if (id) await prisma.news.update({ where: { id }, data })
  else await prisma.news.create({ data })

  const originalIds = existing ? (existing.coverAssetIds.length ? existing.coverAssetIds : (existing.coverAssetId ? [existing.coverAssetId] : [])) : []
  const idsToDelete = originalIds.filter((oid) => !keptImageIds.includes(oid))
  for (const oid of idsToDelete) {
    await deleteMediaAsset(oid)
  }

  revalidatePath('/admin/berita')
  revalidatePath('/berita')
  revalidatePath(`/berita/${data.slug}`)
  revalidatePath('/')
  redirect('/admin/berita?saved=1')
}

export async function deleteNews(fd: FormData) {
  await requireAdmin()
  const id = str(fd, 'id', 'ID')
  const item = await prisma.news.findUnique({ where: { id }, select: { coverAssetId: true, coverAssetIds: true } })
  await prisma.news.delete({ where: { id } })
  const idsToDelete = item ? (item.coverAssetIds.length ? item.coverAssetIds : (item.coverAssetId ? [item.coverAssetId] : [])) : []
  for (const assetId of idsToDelete) {
    await deleteMediaAsset(assetId)
  }
  revalidatePath('/admin/berita')
  revalidatePath('/berita')
  revalidatePath('/')
  redirect('/admin/berita?deleted=1')
}

// ── Announcements ──

export async function upsertAnnouncement(fd: FormData) {
  await requireAdmin()
  const id = optStr(fd, 'id')
  const title = str(fd, 'title', 'Judul')
  const summary = str(fd, 'summary', 'Ringkasan')
  const body = str(fd, 'body', 'Isi pengumuman')
  const s = status(fd)
  const existingSlugs = await prisma.announcement.findMany({
    where: id ? { NOT: { id } } : undefined,
    select: { slug: true },
  })
  const data = {
    title,
    slug: buildUniqueSlug(title, existingSlugs.map((item) => item.slug)),
    summary,
    body,
    status: s,
    publishedAt: s === 'PUBLISHED' ? new Date() : null,
  }
  if (id) await prisma.announcement.update({ where: { id }, data })
  else await prisma.announcement.create({ data })
  revalidatePath('/admin/informasi/pengumuman')
  revalidatePath('/informasi/pengumuman')
  redirect('/admin/informasi/pengumuman?saved=1')
}

export async function deleteAnnouncement(fd: FormData) {
  await requireAdmin()
  await prisma.announcement.delete({ where: { id: str(fd, 'id', 'ID') } })
  revalidatePath('/admin/informasi/pengumuman')
  revalidatePath('/informasi/pengumuman')
  redirect('/admin/informasi/pengumuman?deleted=1')
}

// ── Agenda ──

export async function upsertAgenda(fd: FormData) {
  await requireAdmin()
  const id = optStr(fd, 'id')
  const title = str(fd, 'title', 'Judul')
  const description = str(fd, 'description', 'Deskripsi')
  const location = optStr(fd, 'location')
  const startsAtRaw = optStr(fd, 'startsAt')
  const startsAt = startsAtRaw ? new Date(startsAtRaw) : null
  const s = status(fd)
  const existingSlugs = await prisma.agenda.findMany({
    where: id ? { NOT: { id } } : undefined,
    select: { slug: true },
  })
  const data = { title, slug: buildUniqueSlug(title, existingSlugs.map((item) => item.slug)), description, location, startsAt, status: s }
  if (id) await prisma.agenda.update({ where: { id }, data })
  else await prisma.agenda.create({ data })
  revalidatePath('/admin/informasi/agenda')
  revalidatePath('/informasi/agenda')
  redirect('/admin/informasi/agenda?saved=1')
}

export async function deleteAgenda(fd: FormData) {
  await requireAdmin()
  await prisma.agenda.delete({ where: { id: str(fd, 'id', 'ID') } })
  revalidatePath('/admin/informasi/agenda')
  revalidatePath('/informasi/agenda')
  redirect('/admin/informasi/agenda?deleted=1')
}

// ── Statistics ──

export async function upsertStatistic(fd: FormData) {
  await requireAdmin()
  const id = optStr(fd, 'id')
  const label = str(fd, 'label', 'Label')
  const value = str(fd, 'value', 'Nilai')
  const category = str(fd, 'category', 'Kategori')
  const note = optStr(fd, 'note')
  const order = parseInt(fd.get('order') as string) || 0
  const s = status(fd)
  const data = { label, value, category, note, order, status: s }
  if (id) await prisma.statistic.update({ where: { id }, data })
  else await prisma.statistic.create({ data })
  revalidatePath('/admin/informasi/statistik')
  revalidatePath('/informasi/statistik')
  redirect('/admin/informasi/statistik?saved=1')
}

export async function deleteStatistic(fd: FormData) {
  await requireAdmin()
  await prisma.statistic.delete({ where: { id: str(fd, 'id', 'ID') } })
  revalidatePath('/admin/informasi/statistik')
  revalidatePath('/informasi/statistik')
  redirect('/admin/informasi/statistik?deleted=1')
}

// ── Village Officials ──

export async function upsertOfficial(fd: FormData) {
  await requireAdmin()
  const id = optStr(fd, 'id')
  const name = str(fd, 'name', 'Nama')
  const position = str(fd, 'position', 'Jabatan')
  const bio = optStr(fd, 'bio')
  const order = parseInt(fd.get('order') as string) || 0
  const s = status(fd)
  const keptImageIds = fd.getAll('keptImageIds') as string[]
  const existing = id ? await prisma.villageOfficial.findUnique({ where: { id }, select: { photoAssetId: true, photoAssetIds: true } }) : null
  const newAssets = await uploadMultipleImages(fd, 'photo', {
    purpose: MediaPurpose.OFFICIAL_PHOTO,
    folder: 'aparatur',
    name,
    alt: `Foto aparatur desa ${name}`,
  })
  const newAssetIds = newAssets.map((asset) => asset.id)
  const photoAssetIds = [...keptImageIds, ...newAssetIds]
  const photoAssetId = photoAssetIds[0] || null

  const data = { name, position, bio, order, status: s, photoAssetId, photoAssetIds }
  if (id) await prisma.villageOfficial.update({ where: { id }, data })
  else await prisma.villageOfficial.create({ data })

  const originalIds = existing ? (existing.photoAssetIds.length ? existing.photoAssetIds : (existing.photoAssetId ? [existing.photoAssetId] : [])) : []
  const idsToDelete = originalIds.filter((oid) => !keptImageIds.includes(oid))
  for (const oid of idsToDelete) {
    await deleteMediaAsset(oid)
  }

  revalidatePath('/admin/profil/aparatur')
  revalidatePath('/profil/aparatur')
  redirect('/admin/profil/aparatur?saved=1')
}

export async function deleteOfficial(fd: FormData) {
  await requireAdmin()
  const id = str(fd, 'id', 'ID')
  const item = await prisma.villageOfficial.findUnique({ where: { id }, select: { photoAssetId: true, photoAssetIds: true } })
  await prisma.villageOfficial.delete({ where: { id } })
  const idsToDelete = item ? (item.photoAssetIds.length ? item.photoAssetIds : (item.photoAssetId ? [item.photoAssetId] : [])) : []
  for (const assetId of idsToDelete) {
    await deleteMediaAsset(assetId)
  }
  revalidatePath('/admin/profil/aparatur')
  revalidatePath('/profil/aparatur')
  redirect('/admin/profil/aparatur?deleted=1')
}

// ── Services ──

export async function upsertService(fd: FormData) {
  await requireAdmin()
  const id = optStr(fd, 'id')
  const title = str(fd, 'title', 'Nama layanan')
  const description = str(fd, 'description', 'Deskripsi')
  const requirements = optStr(fd, 'requirements')
  const order = parseInt(fd.get('order') as string) || 0
  const s = status(fd)
  const existingSlugs = await prisma.service.findMany({
    where: id ? { NOT: { id } } : undefined,
    select: { slug: true },
  })
  const data = { title, slug: buildUniqueSlug(title, existingSlugs.map((item) => item.slug)), description, requirements, order, status: s }
  if (id) await prisma.service.update({ where: { id }, data })
  else await prisma.service.create({ data })
  revalidatePath('/admin/layanan')
  revalidatePath('/layanan')
  redirect('/admin/layanan?saved=1')
}

export async function deleteService(fd: FormData) {
  await requireAdmin()
  await prisma.service.delete({ where: { id: str(fd, 'id', 'ID') } })
  revalidatePath('/admin/layanan')
  revalidatePath('/layanan')
  redirect('/admin/layanan?deleted=1')
}

// ── Gallery ──

export async function upsertGalleryItem(fd: FormData) {
  await requireAdmin()
  const id = optStr(fd, 'id')
  const title = str(fd, 'title', 'Judul')
  const description = optStr(fd, 'description')
  const order = parseInt(fd.get('order') as string) || 0
  const s = status(fd)
  const keptImageIds = fd.getAll('keptImageIds') as string[]
  const existing = id ? await prisma.galleryItem.findUnique({ where: { id }, select: { mediaAssetId: true, mediaAssetIds: true } }) : null
  const newAssets = await uploadMultipleImages(fd, 'image', {
    purpose: MediaPurpose.GALLERY,
    folder: 'galeri',
    name: title,
    alt: `Foto galeri ${title}`,
  })
  const newAssetIds = newAssets.map((asset) => asset.id)
  const mediaAssetIds = [...keptImageIds, ...newAssetIds]
  const mediaAssetId = mediaAssetIds[0] || null

  const data = { title, description, order, status: s, mediaAssetId, mediaAssetIds }
  if (id) await prisma.galleryItem.update({ where: { id }, data })
  else await prisma.galleryItem.create({ data })

  const originalIds = existing ? (existing.mediaAssetIds.length ? existing.mediaAssetIds : (existing.mediaAssetId ? [existing.mediaAssetId] : [])) : []
  const idsToDelete = originalIds.filter((oid) => !keptImageIds.includes(oid))
  for (const oid of idsToDelete) {
    await deleteMediaAsset(oid)
  }

  revalidatePath('/admin/galeri')
  revalidatePath('/galeri')
  redirect('/admin/galeri?saved=1')
}

export async function deleteGalleryItem(fd: FormData) {
  await requireAdmin()
  const id = str(fd, 'id', 'ID')
  const item = await prisma.galleryItem.findUnique({ where: { id }, select: { mediaAssetId: true, mediaAssetIds: true } })
  await prisma.galleryItem.delete({ where: { id } })
  const idsToDelete = item ? (item.mediaAssetIds.length ? item.mediaAssetIds : (item.mediaAssetId ? [item.mediaAssetId] : [])) : []
  for (const assetId of idsToDelete) {
    await deleteMediaAsset(assetId)
  }
  revalidatePath('/admin/galeri')
  revalidatePath('/galeri')
  redirect('/admin/galeri?deleted=1')
}

// ── Products ──

export async function upsertProduct(fd: FormData) {
  await requireAdmin()
  const id = optStr(fd, 'id')
  const name = str(fd, 'name', 'Nama produk')
  const description = str(fd, 'description', 'Deskripsi')
  const contact = optStr(fd, 'contact')
  const s = status(fd)
  const keptImageIds = fd.getAll('keptImageIds') as string[]
  const existing = id ? await prisma.product.findUnique({ where: { id }, select: { imageAssetId: true, imageAssetIds: true } }) : null
  const newAssets = await uploadMultipleImages(fd, 'image', {
    purpose: MediaPurpose.PRODUCT_IMAGE,
    folder: 'produk',
    name,
    alt: `Foto produk ${name}`,
  })
  const newAssetIds = newAssets.map((asset) => asset.id)
  const imageAssetIds = [...keptImageIds, ...newAssetIds]
  const imageAssetId = imageAssetIds[0] || null

  const existingSlugs = await prisma.product.findMany({
    where: id ? { NOT: { id } } : undefined,
    select: { slug: true },
  })
  const data = { name, slug: buildUniqueSlug(name, existingSlugs.map((item) => item.slug)), description, contact, status: s, imageAssetId, imageAssetIds }
  if (id) await prisma.product.update({ where: { id }, data })
  else await prisma.product.create({ data })

  const originalIds = existing ? (existing.imageAssetIds.length ? existing.imageAssetIds : (existing.imageAssetId ? [existing.imageAssetId] : [])) : []
  const idsToDelete = originalIds.filter((oid) => !keptImageIds.includes(oid))
  for (const oid of idsToDelete) {
    await deleteMediaAsset(oid)
  }

  revalidatePath('/admin/produk')
  revalidatePath('/produk')
  redirect('/admin/produk?saved=1')
}

export async function deleteProduct(fd: FormData) {
  await requireAdmin()
  const id = str(fd, 'id', 'ID')
  const item = await prisma.product.findUnique({ where: { id }, select: { imageAssetId: true, imageAssetIds: true } })
  await prisma.product.delete({ where: { id } })
  const idsToDelete = item ? (item.imageAssetIds.length ? item.imageAssetIds : (item.imageAssetId ? [item.imageAssetId] : [])) : []
  for (const assetId of idsToDelete) {
    await deleteMediaAsset(assetId)
  }
  revalidatePath('/admin/produk')
  revalidatePath('/produk')
  redirect('/admin/produk?deleted=1')
}

// ── Budget Items ──

export async function upsertBudgetItem(fd: FormData) {
  await requireAdmin()
  const id = optStr(fd, 'id')
  const label = str(fd, 'label', 'Label')
  const value = str(fd, 'value', 'Nilai')
  const description = str(fd, 'description', 'Keterangan')
  const year = parseInt(fd.get('year') as string) || new Date().getFullYear()
  const order = parseInt(fd.get('order') as string) || 0
  const s = status(fd)
  const data = { label, value, description, year, order, status: s }
  if (id) await prisma.budgetItem.update({ where: { id }, data })
  else await prisma.budgetItem.create({ data })
  revalidatePath('/admin/anggaran')
  revalidatePath('/')
  redirect('/admin/anggaran?saved=1')
}

export async function deleteBudgetItem(fd: FormData) {
  await requireAdmin()
  await prisma.budgetItem.delete({ where: { id: str(fd, 'id', 'ID') } })
  revalidatePath('/admin/anggaran')
  revalidatePath('/')
  redirect('/admin/anggaran?deleted=1')
}

// ── Complaints (read + status update only) ──

export async function updateComplaintStatus(fd: FormData) {
  await requireAdmin()
  const id = str(fd, 'id', 'ID')
  const s = fd.get('status') as string
  if (!['NEW', 'IN_REVIEW', 'RESOLVED', 'REJECTED'].includes(s)) throw new Error('Status invalid.')
  await prisma.complaint.update({ where: { id }, data: { status: s as 'NEW' | 'IN_REVIEW' | 'RESOLVED' | 'REJECTED' } })
  revalidatePath('/admin/layanan/pengaduan')
  redirect('/admin/layanan/pengaduan?saved=1')
}

// ── Village Profile ──

export async function updateProfile(fd: FormData) {
  await requireAdmin()
  const name = 'Desa Cilalawi'
  const tagline = str(fd, 'tagline', 'Tagline')
  const description = str(fd, 'description', 'Deskripsi')
  const address = optStr(fd, 'address')
  const phone = optStr(fd, 'phone')
  const email = optStr(fd, 'email')
  const mapUrl = optStr(fd, 'mapUrl')
  await prisma.villageProfile.upsert({
    where: { name },
    update: { tagline, description, address, phone, email, mapUrl },
    create: { name, tagline, description, address, phone, email, mapUrl },
  })
  revalidatePath('/admin/profil')
  revalidatePath('/profil')
  revalidatePath('/kontak')
  revalidatePath('/peta')
  revalidatePath('/')
  redirect('/admin/profil?saved=1')
}

// ── Site Settings ──

export async function updateSetting(fd: FormData) {
  await requireAdmin()
  const key = str(fd, 'key', 'Key')
  const value = str(fd, 'value', 'Isi')
  const description = optStr(fd, 'description')
  await prisma.siteSetting.upsert({
    where: { key },
    update: { value, description },
    create: { key, value, description },
  })
  for (const path of ['/', '/admin/pengaturan', '/profil', '/profil/sejarah', '/profil/visi-misi', '/kontak', '/peta']) {
    revalidatePath(path)
  }
  redirect('/admin/pengaturan?saved=1')
}
