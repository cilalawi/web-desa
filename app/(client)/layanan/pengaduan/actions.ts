'use server'

import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

function getRequiredString(formData: FormData, key: string, label: string) {
  const value = formData.get(key)
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`${label} wajib diisi.`)
  }
  return value.trim()
}

export async function createComplaint(formData: FormData) {
  const nik = getRequiredString(formData, 'nik', 'NIK')
  const name = getRequiredString(formData, 'nama', 'Nama')
  const phone = getRequiredString(formData, 'telepon', 'No. Telp')
  const message = getRequiredString(formData, 'isi', 'Isi pengaduan')
  const emailValue = formData.get('email')
  const email = typeof emailValue === 'string' && emailValue.trim() ? emailValue.trim() : null

  if (nik.length < 8 || nik.length > 32) {
    throw new Error('NIK harus berisi 8 sampai 32 karakter.')
  }

  if (message.length < 10) {
    throw new Error('Isi pengaduan minimal 10 karakter.')
  }

  await prisma.complaint.create({
    data: {
      nik,
      name,
      email,
      phone,
      message,
    },
  })

  redirect('/layanan/pengaduan?status=terkirim')
}
