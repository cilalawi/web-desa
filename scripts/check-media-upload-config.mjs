import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const read = (path) => readFileSync(join(root, path), 'utf8')

const pkg = JSON.parse(read('package.json'))
assert.ok(pkg.dependencies['@vercel/blob'], '@vercel/blob dependency is required')
assert.equal(pkg.scripts['check:media-upload'], 'node scripts/check-media-upload-config.mjs')

const nextConfig = read('next.config.ts')
assert.match(nextConfig, /remotePatterns/)
assert.match(nextConfig, /public\.blob\.vercel-storage\.com/)
assert.match(nextConfig, /bodySizeLimit:\s*'6mb'/)

const helper = read('lib/media-upload.ts')
for (const text of ['@vercel/blob', 'put(', 'del(', 'MAX_IMAGE_SIZE', 'image/jpeg', 'image/png', 'image/webp', 'image/avif', 'MediaPurpose']) {
  assert.match(helper, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `media helper missing ${text}`)
}
assert.doesNotMatch(helper, /image\/svg\+xml/)

const inputs = read('components/admin/AdminInputs.tsx')
assert.match(inputs, /export function FileField/)
assert.match(inputs, /type="file"/)
assert.match(inputs, /accept=\{accept\}/)

const actions = read('app/(admin)/admin/actions.ts')
for (const text of ['optionalImageFile', 'uploadImageAsset', 'deleteMediaAsset', 'coverAssetId', 'mediaAssetId', 'imageAssetId', 'photoAssetId']) {
  assert.match(actions, new RegExp(text), `actions missing ${text}`)
}

const adminForms = [
  ['app/(admin)/admin/berita/page.tsx', 'coverImage'],
  ['app/(admin)/admin/galeri/page.tsx', 'image'],
  ['app/(admin)/admin/produk/page.tsx', 'image'],
  ['app/(admin)/admin/profil/aparatur/page.tsx', 'photo'],
]
for (const [path, field] of adminForms) {
  const source = read(path)
  assert.match(source, /FileField/)
  assert.match(source, new RegExp(`name="${field}"`))
  assert.match(source, /prisma\.mediaAsset\.findMany/)
}

const newsCard = read('components/public/NewsCard.tsx')
assert.match(newsCard, /import Image from 'next\/image'/)
assert.match(newsCard, /image\?: NewsImage/)

const newsList = read('app/(client)/berita/page.tsx')
assert.match(newsList, /coverAssetId/)
assert.match(newsList, /prisma\.mediaAsset\.findMany/)
assert.match(newsList, /image=\{item\.coverAssetId/)

const newsDetail = read('app/(client)/berita/[slug]/page.tsx')
assert.match(newsDetail, /import Image from 'next\/image'/)
assert.match(newsDetail, /coverAssetId/)
assert.match(newsDetail, /prisma\.mediaAsset\.findUnique/)

const homeData = read('lib/home-data.ts')
assert.match(homeData, /newsCoverAsset/)
assert.match(homeData, /prisma\.mediaAsset\.findMany/)

const homePage = read('app/(client)/page.tsx')
assert.match(homePage, /newsCoverAsset/)
assert.match(homePage, /image=\{item\.coverAssetId/)

console.log('media upload wiring ok')
