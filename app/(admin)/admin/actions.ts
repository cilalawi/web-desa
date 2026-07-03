'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { ContentStatus, MediaPurpose } from '@/app/generated/prisma/client'
import { requireAdmin } from '@/lib/admin-auth'
import { deleteMediaAsset, optionalImageFile, uploadImageAsset } from '@/lib/media-upload'
import { prisma } from '@/lib/prisma'

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

function slug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
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

// ── News ──

export async function upsertNews(fd: FormData) {
  await requireAdmin()
  const id = optStr(fd, 'id')
  const title = str(fd, 'title', 'Judul')
  const excerpt = str(fd, 'excerpt', 'Ringkasan')
  const body = str(fd, 'body', 'Isi berita')
  const s = status(fd)
  const existing = id ? await prisma.news.findUnique({ where: { id }, select: { coverAssetId: true } }) : null
  const coverAsset = await uploadOptionalImage(fd, 'coverImage', {
    purpose: MediaPurpose.COVER,
    folder: 'berita',
    name: title,
    alt: `Gambar sampul berita ${title}`,
  })
  const data = {
    title,
    slug: slug(title),
    excerpt,
    body,
    status: s,
    publishedAt: s === 'PUBLISHED' ? new Date() : null,
    ...(coverAsset ? { coverAssetId: coverAsset.id } : {}),
  }
  if (id) await prisma.news.update({ where: { id }, data })
  else await prisma.news.create({ data })
  if (coverAsset && existing?.coverAssetId) await deleteMediaAsset(existing.coverAssetId)
  revalidatePath('/admin/berita')
  revalidatePath('/berita')
  revalidatePath(`/berita/${data.slug}`)
  revalidatePath('/')
  redirect('/admin/berita?saved=1')
}

export async function deleteNews(fd: FormData) {
  await requireAdmin()
  const id = str(fd, 'id', 'ID')
  const item = await prisma.news.findUnique({ where: { id }, select: { coverAssetId: true } })
  await prisma.news.delete({ where: { id } })
  await deleteMediaAsset(item?.coverAssetId)
  revalidatePath('/admin/berita')
  revalidatePath('/berita')
  revalidatePath('/')
  redirect('/admin/berita')
}

// ── Announcements ──

export async function upsertAnnouncement(fd: FormData) {
  await requireAdmin()
  const id = optStr(fd, 'id')
  const title = str(fd, 'title', 'Judul')
  const summary = str(fd, 'summary', 'Ringkasan')
  const body = str(fd, 'body', 'Isi pengumuman')
  const s = status(fd)
  const data = {
    title, slug: slug(title), summary, body, status: s,
    publishedAt: s === 'PUBLISHED' ? new Date() : null,
  }
  if (id) await prisma.announcement.update({ where: { id }, data })
  else await prisma.announcement.create({ data })
  revalidatePath('/admin/informasi/pengumuman')
  revalidatePath('/informasi/pengumuman')
  redirect('/admin/informasi/pengumuman')
}

export async function deleteAnnouncement(fd: FormData) {
  await requireAdmin()
  await prisma.announcement.delete({ where: { id: str(fd, 'id', 'ID') } })
  revalidatePath('/admin/informasi/pengumuman')
  revalidatePath('/informasi/pengumuman')
  redirect('/admin/informasi/pengumuman')
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
  const data = { title, slug: slug(title), description, location, startsAt, status: s }
  if (id) await prisma.agenda.update({ where: { id }, data })
  else await prisma.agenda.create({ data })
  revalidatePath('/admin/informasi/agenda')
  revalidatePath('/informasi/agenda')
  redirect('/admin/informasi/agenda')
}

export async function deleteAgenda(fd: FormData) {
  await requireAdmin()
  await prisma.agenda.delete({ where: { id: str(fd, 'id', 'ID') } })
  revalidatePath('/admin/informasi/agenda')
  revalidatePath('/informasi/agenda')
  redirect('/admin/informasi/agenda')
}

// ── Statistics ──

export async function upsertStatistic(fd: FormData) {
  await requireAdmin()
  const id = optStr(fd, 'id')
  const label = str(fd, 'label', 'Label')
  const value = str(fd, 'value', 'Nilai')
  const note = optStr(fd, 'note')
  const order = parseInt(fd.get('order') as string) || 0
  const s = status(fd)
  const data = { label, value, note, order, status: s }
  if (id) await prisma.statistic.update({ where: { id }, data })
  else await prisma.statistic.create({ data })
  revalidatePath('/admin/informasi/statistik')
  revalidatePath('/informasi/statistik')
  redirect('/admin/informasi/statistik')
}

export async function deleteStatistic(fd: FormData) {
  await requireAdmin()
  await prisma.statistic.delete({ where: { id: str(fd, 'id', 'ID') } })
  revalidatePath('/admin/informasi/statistik')
  revalidatePath('/informasi/statistik')
  redirect('/admin/informasi/statistik')
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
  const existing = id ? await prisma.villageOfficial.findUnique({ where: { id }, select: { photoAssetId: true } }) : null
  const photoAsset = await uploadOptionalImage(fd, 'photo', {
    purpose: MediaPurpose.OFFICIAL_PHOTO,
    folder: 'aparatur',
    name,
    alt: `Foto aparatur desa ${name}`,
  })
  const data = { name, position, bio, order, status: s, ...(photoAsset ? { photoAssetId: photoAsset.id } : {}) }
  if (id) await prisma.villageOfficial.update({ where: { id }, data })
  else await prisma.villageOfficial.create({ data })
  if (photoAsset && existing?.photoAssetId) await deleteMediaAsset(existing.photoAssetId)
  revalidatePath('/admin/profil/aparatur')
  revalidatePath('/profil/aparatur')
  redirect('/admin/profil/aparatur')
}

export async function deleteOfficial(fd: FormData) {
  await requireAdmin()
  const id = str(fd, 'id', 'ID')
  const item = await prisma.villageOfficial.findUnique({ where: { id }, select: { photoAssetId: true } })
  await prisma.villageOfficial.delete({ where: { id } })
  await deleteMediaAsset(item?.photoAssetId)
  revalidatePath('/admin/profil/aparatur')
  revalidatePath('/profil/aparatur')
  redirect('/admin/profil/aparatur')
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
  const data = { title, slug: slug(title), description, requirements, order, status: s }
  if (id) await prisma.service.update({ where: { id }, data })
  else await prisma.service.create({ data })
  revalidatePath('/admin/layanan')
  revalidatePath('/layanan')
  redirect('/admin/layanan')
}

export async function deleteService(fd: FormData) {
  await requireAdmin()
  await prisma.service.delete({ where: { id: str(fd, 'id', 'ID') } })
  revalidatePath('/admin/layanan')
  revalidatePath('/layanan')
  redirect('/admin/layanan')
}

// ── Gallery ──

export async function upsertGalleryItem(fd: FormData) {
  await requireAdmin()
  const id = optStr(fd, 'id')
  const title = str(fd, 'title', 'Judul')
  const description = optStr(fd, 'description')
  const order = parseInt(fd.get('order') as string) || 0
  const s = status(fd)
  const existing = id ? await prisma.galleryItem.findUnique({ where: { id }, select: { mediaAssetId: true } }) : null
  const mediaAsset = await uploadOptionalImage(fd, 'image', {
    purpose: MediaPurpose.GALLERY,
    folder: 'galeri',
    name: title,
    alt: `Foto galeri ${title}`,
  })
  const data = { title, description, order, status: s, ...(mediaAsset ? { mediaAssetId: mediaAsset.id } : {}) }
  if (id) await prisma.galleryItem.update({ where: { id }, data })
  else await prisma.galleryItem.create({ data })
  if (mediaAsset && existing?.mediaAssetId) await deleteMediaAsset(existing.mediaAssetId)
  revalidatePath('/admin/galeri')
  revalidatePath('/galeri')
  redirect('/admin/galeri')
}

export async function deleteGalleryItem(fd: FormData) {
  await requireAdmin()
  const id = str(fd, 'id', 'ID')
  const item = await prisma.galleryItem.findUnique({ where: { id }, select: { mediaAssetId: true } })
  await prisma.galleryItem.delete({ where: { id } })
  await deleteMediaAsset(item?.mediaAssetId)
  revalidatePath('/admin/galeri')
  revalidatePath('/galeri')
  redirect('/admin/galeri')
}

// ── Products ──

export async function upsertProduct(fd: FormData) {
  await requireAdmin()
  const id = optStr(fd, 'id')
  const name = str(fd, 'name', 'Nama produk')
  const description = str(fd, 'description', 'Deskripsi')
  const contact = optStr(fd, 'contact')
  const s = status(fd)
  const existing = id ? await prisma.product.findUnique({ where: { id }, select: { imageAssetId: true } }) : null
  const imageAsset = await uploadOptionalImage(fd, 'image', {
    purpose: MediaPurpose.PRODUCT_IMAGE,
    folder: 'produk',
    name,
    alt: `Foto produk ${name}`,
  })
  const data = { name, slug: slug(name), description, contact, status: s, ...(imageAsset ? { imageAssetId: imageAsset.id } : {}) }
  if (id) await prisma.product.update({ where: { id }, data })
  else await prisma.product.create({ data })
  if (imageAsset && existing?.imageAssetId) await deleteMediaAsset(existing.imageAssetId)
  revalidatePath('/admin/produk')
  revalidatePath('/produk')
  redirect('/admin/produk')
}

export async function deleteProduct(fd: FormData) {
  await requireAdmin()
  const id = str(fd, 'id', 'ID')
  const item = await prisma.product.findUnique({ where: { id }, select: { imageAssetId: true } })
  await prisma.product.delete({ where: { id } })
  await deleteMediaAsset(item?.imageAssetId)
  revalidatePath('/admin/produk')
  revalidatePath('/produk')
  redirect('/admin/produk')
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
  redirect('/admin/anggaran')
}

export async function deleteBudgetItem(fd: FormData) {
  await requireAdmin()
  await prisma.budgetItem.delete({ where: { id: str(fd, 'id', 'ID') } })
  revalidatePath('/admin/anggaran')
  revalidatePath('/')
  redirect('/admin/anggaran')
}

// ── Complaints (read + status update only) ──

export async function updateComplaintStatus(fd: FormData) {
  await requireAdmin()
  const id = str(fd, 'id', 'ID')
  const s = fd.get('status') as string
  if (!['NEW', 'IN_REVIEW', 'RESOLVED', 'REJECTED'].includes(s)) throw new Error('Status invalid.')
  await prisma.complaint.update({ where: { id }, data: { status: s as 'NEW' | 'IN_REVIEW' | 'RESOLVED' | 'REJECTED' } })
  revalidatePath('/admin/layanan/pengaduan')
  redirect('/admin/layanan/pengaduan')
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
  redirect('/admin/profil')
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
  redirect('/admin/pengaturan')
}
