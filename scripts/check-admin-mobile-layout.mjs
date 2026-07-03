import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const read = (path) => readFileSync(join(root, path), 'utf8')

const sidebar = read('components/admin/AdminSidebar.tsx')
assert.match(sidebar, /export function AdminMobileNav/)
assert.match(sidebar, /md:hidden/)
assert.match(sidebar, /overflow-x-auto/)
assert.match(sidebar, /adminMobileLinks/)
assert.doesNotMatch(sidebar, /<aside[^>]+hidden h-screen[^>]+md:flex/)

const layout = read('app/(admin)/admin/layout.tsx')
assert.match(layout, /<AdminMobileNav \/>/)
assert.match(layout, /md:grid-cols-\[280px_1fr\]/)
assert.match(layout, /min-w-0/)

const header = read('components/admin/AdminHeader.tsx')
assert.match(header, /px-4 md:px-6/)
assert.match(header, /text-lg/)

for (const path of [
  'app/(admin)/admin/berita/page.tsx',
  'app/(admin)/admin/galeri/page.tsx',
  'app/(admin)/admin/produk/page.tsx',
  'app/(admin)/admin/profil/aparatur/page.tsx',
  'app/(admin)/admin/layanan/page.tsx',
  'app/(admin)/admin/informasi/statistik/page.tsx',
  'app/(admin)/admin/anggaran/page.tsx',
  'app/(admin)/admin/informasi/pengumuman/page.tsx',
  'app/(admin)/admin/informasi/agenda/page.tsx',
]) {
  const source = read(path)
  assert.doesNotMatch(source, /flex items-start justify-between gap-4/, `${path} still uses cramped mobile header row`)
  assert.match(source, /flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between/, `${path} should stack page action row on mobile`)
}

console.log('admin mobile layout wiring ok')
