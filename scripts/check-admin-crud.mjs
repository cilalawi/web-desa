import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = '/home/wign/Projects/Kkn/web'
const actions = readFileSync(join(root, 'app/(admin)/admin/actions.ts'), 'utf8')
const page = (path) => readFileSync(join(root, path), 'utf8')

const modules = [
  ['berita', 'app/(admin)/admin/berita/page.tsx', 'upsertNews', 'deleteNews'],
  ['pengumuman', 'app/(admin)/admin/informasi/pengumuman/page.tsx', 'upsertAnnouncement', 'deleteAnnouncement'],
  ['agenda', 'app/(admin)/admin/informasi/agenda/page.tsx', 'upsertAgenda', 'deleteAgenda'],
  ['statistik', 'app/(admin)/admin/informasi/statistik/page.tsx', 'upsertStatistic', 'deleteStatistic'],
  ['aparatur', 'app/(admin)/admin/profil/aparatur/page.tsx', 'upsertOfficial', 'deleteOfficial'],
  ['layanan', 'app/(admin)/admin/layanan/page.tsx', 'upsertService', 'deleteService'],
  ['galeri', 'app/(admin)/admin/galeri/page.tsx', 'upsertGalleryItem', 'deleteGalleryItem'],
  ['produk', 'app/(admin)/admin/produk/page.tsx', 'upsertProduct', 'deleteProduct'],
  ['anggaran', 'app/(admin)/admin/anggaran/page.tsx', 'upsertBudgetItem', 'deleteBudgetItem'],
]

const missing = []
for (const [name, path, upsert, del] of modules) {
  const src = page(path)
  if (!actions.includes(`export async function ${upsert}`)) missing.push(`${name}: missing action ${upsert}`)
  if (!actions.includes(`export async function ${del}`)) missing.push(`${name}: missing action ${del}`)
  if (!src.includes(upsert)) missing.push(`${name}: page does not use ${upsert}`)
  if (!src.includes(del)) missing.push(`${name}: page does not use ${del}`)
  if (!src.includes('AdminCrudDialog')) missing.push(`${name}: missing create/edit dialog`)
}

const complaints = page('app/(admin)/admin/layanan/pengaduan/page.tsx')
if (!actions.includes('export async function updateComplaintStatus')) missing.push('pengaduan: missing status action')
if (!complaints.includes('updateComplaintStatus')) missing.push('pengaduan: page does not use status action')

if (missing.length) {
  console.error(missing.join('\n'))
  process.exit(1)
}
console.log('admin crud wiring ok')
