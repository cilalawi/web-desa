import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const read = (path) => readFileSync(join(root, path), 'utf8')

const submitButton = read('components/admin/FormSubmitButton.tsx')
assert.match(submitButton, /Menyimpan data…/, 'submit button should use clearer pending copy')
assert.match(submitButton, /animate-spin/, 'submit button should show a spinner while pending')

const notice = read('components/admin/SaveNotice.tsx')
assert.match(notice, /type\?: 'saved' \| 'deleted'/, 'SaveNotice should support saved and deleted states')
assert.match(notice, /Data berhasil disimpan\./, 'SaveNotice should include saved message')
assert.match(notice, /Data berhasil dihapus\./, 'SaveNotice should include deleted message')

const actions = read('app/(admin)/admin/actions.ts')
for (const path of [
  '/admin/berita?saved=1',
  '/admin/berita?deleted=1',
  '/admin/informasi/pengumuman?saved=1',
  '/admin/informasi/pengumuman?deleted=1',
  '/admin/informasi/agenda?saved=1',
  '/admin/informasi/agenda?deleted=1',
  '/admin/informasi/statistik?saved=1',
  '/admin/informasi/statistik?deleted=1',
  '/admin/profil/aparatur?saved=1',
  '/admin/profil/aparatur?deleted=1',
  '/admin/layanan?saved=1',
  '/admin/layanan?deleted=1',
  '/admin/layanan/pengaduan?saved=1',
  '/admin/galeri?saved=1',
  '/admin/galeri?deleted=1',
  '/admin/produk?saved=1',
  '/admin/produk?deleted=1',
  '/admin/anggaran?saved=1',
  '/admin/anggaran?deleted=1',
  '/admin/profil?saved=1',
  '/admin/pengaturan?saved=1',
]) {
  assert.match(actions, new RegExp(path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `missing redirect ${path}`)
}

for (const page of [
  'app/(admin)/admin/berita/page.tsx',
  'app/(admin)/admin/informasi/pengumuman/page.tsx',
  'app/(admin)/admin/informasi/agenda/page.tsx',
  'app/(admin)/admin/informasi/statistik/page.tsx',
  'app/(admin)/admin/profil/page.tsx',
  'app/(admin)/admin/profil/aparatur/page.tsx',
  'app/(admin)/admin/layanan/page.tsx',
  'app/(admin)/admin/layanan/pengaduan/page.tsx',
  'app/(admin)/admin/galeri/page.tsx',
  'app/(admin)/admin/produk/page.tsx',
  'app/(admin)/admin/anggaran/page.tsx',
  'app/(admin)/admin/pengaturan/page.tsx',
]) {
  const source = read(page)
  assert.match(source, /SaveNotice/, `${page} should render SaveNotice`)
  assert.match(source, /searchParams/, `${page} should read searchParams`)
}

console.log('admin form feedback wiring ok')
