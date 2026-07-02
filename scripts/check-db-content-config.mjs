import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const read = (path) => readFileSync(join(root, path), 'utf8')

const requiredKeys = [
  'home.hero.title',
  'home.hero.primaryCtaLabel',
  'home.hero.primaryCtaHref',
  'home.hero.secondaryCtaLabel',
  'home.hero.secondaryCtaHref',
  'home.hero.imageUrl',
  'home.hero.imageAlt',
  'home.services.eyebrow',
  'home.services.title',
  'home.services.description',
  'home.announcements.eyebrow',
  'home.announcements.title',
  'home.announcements.description',
  'home.welcome.eyebrow',
  'home.welcome.title',
  'home.welcome.heading',
  'home.welcome.body',
  'home.news.eyebrow',
  'home.news.title',
  'home.news.description',
  'home.budget.eyebrow',
  'home.budget.title',
  'home.budget.description',
  'home.services.imageUrl',
  'home.services.imageAlt',
  'home.budget.imageUrl',
  'home.budget.imageAlt',
  'empty.statistics',
  'empty.announcements',
  'empty.news',
  'empty.budget',
  'empty.profileDetail',
  'empty.history',
  'empty.map',
  'empty.contactAddress',
  'empty.contactPhone',
  'empty.contactEmail',
]

const helper = read('lib/site-settings.ts')
for (const key of requiredKeys) assert.match(helper, new RegExp(`key: '${key.replaceAll('.', '\\.')}'`), `missing setting metadata ${key}`)
assert.match(helper, /export function settingsToMap/)
assert.match(helper, /export function settingValue/)
assert.match(helper, /defaultValue: '\/pemandangan\.jpeg'/)
assert.match(helper, /defaultValue: 'Pemandangan Desa Cilalawi'/)

const officialsPage = read('app/(client)/profil/aparatur/page.tsx')
assert.match(officialsPage, /photoAssetId/)
assert.match(officialsPage, /mediaAsset/)
assert.match(officialsPage, /MockOfficialPhoto/)

const adminSettings = read('app/(admin)/admin/pengaturan/page.tsx')
assert.match(adminSettings, /SITE_SETTING_GROUPS/)
assert.doesNotMatch(adminSettings, /const settings = \[/)

const homeData = read('lib/home-data.ts')
assert.match(homeData, /prisma\.siteSetting\.findMany/)
assert.match(homeData, /settingsToMap/)

const homePage = read('app/(client)/page.tsx')
for (const text of [
  'Website Desa Cilalawi',
  'Akses layanan desa lebih jelas',
  'Informasi resmi dari pemerintah desa',
  'Pemerintah Desa Cilalawi',
  'Kabar Desa Cilalawi',
  'APBDes siap dipublikasikan',
  '/art/cilalawi-hero.svg',
]) {
  assert.doesNotMatch(homePage, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `homepage still hardcodes ${text}`)
}

const seed = read('prisma/seed.ts')
for (const key of requiredKeys) assert.match(seed, new RegExp(`key: '${key.replaceAll('.', '\\.')}'`), `seed missing ${key}`)

assert.equal(existsSync(join(root, 'lib/site-data.ts')), false, 'lib/site-data.ts should be removed')

console.log('db content wiring ok')
