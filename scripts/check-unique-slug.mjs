import assert from 'node:assert/strict'
import { buildUniqueSlug, slugify } from '../lib/slug.ts'

assert.equal(slugify('Jadwal layanan kantor desa'), 'jadwal-layanan-kantor-desa')
assert.equal(buildUniqueSlug('Jadwal layanan kantor desa', []), 'jadwal-layanan-kantor-desa')
assert.equal(
  buildUniqueSlug('Jadwal layanan kantor desa', ['jadwal-layanan-kantor-desa']),
  'jadwal-layanan-kantor-desa-2'
)
assert.equal(
  buildUniqueSlug('Jadwal layanan kantor desa', ['jadwal-layanan-kantor-desa', 'jadwal-layanan-kantor-desa-2']),
  'jadwal-layanan-kantor-desa-3'
)

console.log('unique slug helper ok')
