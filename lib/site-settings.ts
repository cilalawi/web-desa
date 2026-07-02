import { prisma } from '@/lib/prisma'

export type SiteSettingInput = { key: string; value: string | null }

type FieldType = 'text' | 'textarea' | 'url'

export type SiteSettingMeta = {
  key: string
  title: string
  description: string
  defaultValue: string
  field: FieldType
}

export type SiteSettingGroup = {
  title: string
  description: string
  settings: SiteSettingMeta[]
}

export const SITE_SETTING_GROUPS: SiteSettingGroup[] = [
  {
    title: 'Beranda: Hero',
    description: 'Teks utama, tombol, dan ilustrasi awal halaman beranda.',
    settings: [
      { key: 'home.hero.title', title: 'Judul utama', description: 'Judul besar di hero beranda.', defaultValue: 'Website Desa Cilalawi', field: 'text' },
      { key: 'home.hero.primaryCtaLabel', title: 'Label tombol utama', description: 'Teks tombol pengaduan di hero.', defaultValue: 'Ajukan Pengaduan', field: 'text' },
      { key: 'home.hero.primaryCtaHref', title: 'Link tombol utama', description: 'Tujuan tombol utama.', defaultValue: '/layanan/pengaduan', field: 'text' },
      { key: 'home.hero.secondaryCtaLabel', title: 'Label tombol kedua', description: 'Teks tombol pengumuman di hero.', defaultValue: 'Lihat Pengumuman', field: 'text' },
      { key: 'home.hero.secondaryCtaHref', title: 'Link tombol kedua', description: 'Tujuan tombol kedua.', defaultValue: '/informasi/pengumuman', field: 'text' },
      { key: 'home.hero.imageUrl', title: 'URL ilustrasi hero', description: 'Path gambar hero.', defaultValue: '/pemandangan.jpeg', field: 'url' },
      { key: 'home.hero.imageAlt', title: 'Alt ilustrasi hero', description: 'Teks alternatif gambar hero.', defaultValue: 'Pemandangan Desa Cilalawi', field: 'text' },
    ],
  },
  {
    title: 'Beranda: Section',
    description: 'Judul dan deskripsi setiap bagian beranda.',
    settings: [
      { key: 'home.services.eyebrow', title: 'Eyebrow layanan', description: 'Label kecil section layanan.', defaultValue: 'Layanan', field: 'text' },
      { key: 'home.services.title', title: 'Judul layanan', description: 'Judul section layanan.', defaultValue: 'Akses layanan desa lebih jelas', field: 'text' },
      { key: 'home.services.description', title: 'Deskripsi layanan', description: 'Deskripsi section layanan.', defaultValue: 'Warga dapat menemukan kanal pengaduan, pengumuman, dan informasi publik tanpa harus mencari dari banyak tempat.', field: 'textarea' },
      { key: 'home.announcements.eyebrow', title: 'Eyebrow pengumuman', description: 'Label kecil section pengumuman.', defaultValue: 'Pengumuman', field: 'text' },
      { key: 'home.announcements.title', title: 'Judul pengumuman', description: 'Judul section pengumuman.', defaultValue: 'Informasi resmi dari pemerintah desa', field: 'text' },
      { key: 'home.announcements.description', title: 'Deskripsi pengumuman', description: 'Deskripsi section pengumuman.', defaultValue: 'Pengumuman dan agenda desa disusun agar warga dapat melihat informasi terbaru dari satu halaman.', field: 'textarea' },
      { key: 'home.welcome.eyebrow', title: 'Eyebrow sambutan', description: 'Label kecil section sambutan.', defaultValue: 'Sambutan', field: 'text' },
      { key: 'home.welcome.title', title: 'Judul sambutan', description: 'Judul besar section sambutan.', defaultValue: 'Pemerintah Desa Cilalawi', field: 'text' },
      { key: 'home.welcome.heading', title: 'Subjudul sambutan', description: 'Kalimat tebal section sambutan.', defaultValue: 'Pelayanan publik yang terbuka dan mudah diakses', field: 'text' },
      { key: 'home.welcome.body', title: 'Isi sambutan', description: 'Isi pendek section sambutan.', defaultValue: 'Website ini disiapkan sebagai ruang informasi resmi, kanal layanan warga, dan media transparansi desa.', field: 'textarea' },
      { key: 'home.news.eyebrow', title: 'Eyebrow berita', description: 'Label kecil section berita.', defaultValue: 'Berita', field: 'text' },
      { key: 'home.news.title', title: 'Judul berita', description: 'Judul section berita.', defaultValue: 'Kabar Desa Cilalawi', field: 'text' },
      { key: 'home.news.description', title: 'Deskripsi berita', description: 'Deskripsi section berita.', defaultValue: 'Publikasi kegiatan, program, dan potensi desa dikelola agar warga dapat mengikuti perkembangan terbaru.', field: 'textarea' },
      { key: 'home.budget.eyebrow', title: 'Eyebrow transparansi', description: 'Label kecil section APBDes.', defaultValue: 'Transparansi', field: 'text' },
      { key: 'home.budget.title', title: 'Judul transparansi', description: 'Judul section APBDes.', defaultValue: 'APBDes siap dipublikasikan', field: 'text' },
      { key: 'home.budget.description', title: 'Deskripsi transparansi', description: 'Deskripsi section APBDes.', defaultValue: 'Data anggaran ditampilkan setelah diverifikasi oleh admin desa agar informasi yang tampil tetap akurat.', field: 'textarea' },
      { key: 'home.services.imageUrl', title: 'URL ilustrasi layanan', description: 'Path gambar layanan.', defaultValue: '/art/civic-services.svg', field: 'url' },
      { key: 'home.services.imageAlt', title: 'Alt ilustrasi layanan', description: 'Teks alternatif gambar layanan.', defaultValue: 'Ilustrasi layanan warga Desa Cilalawi', field: 'text' },
      { key: 'home.budget.imageUrl', title: 'URL ilustrasi APBDes', description: 'Path gambar APBDes.', defaultValue: '/art/transparent-budget.svg', field: 'url' },
      { key: 'home.budget.imageAlt', title: 'Alt ilustrasi APBDes', description: 'Teks alternatif gambar APBDes.', defaultValue: 'Ilustrasi transparansi APBDes Desa Cilalawi', field: 'text' },
    ],
  },
  {
    title: 'Konten kosong & fallback',
    description: 'Pesan yang muncul saat data utama belum diisi.',
    settings: [
      { key: 'empty.statistics', title: 'Statistik kosong', description: 'Pesan saat statistik belum tersedia.', defaultValue: 'Data statistik belum tersedia.', field: 'text' },
      { key: 'empty.announcements', title: 'Pengumuman kosong', description: 'Pesan saat pengumuman belum diterbitkan.', defaultValue: 'Belum ada pengumuman yang diterbitkan.', field: 'text' },
      { key: 'empty.news', title: 'Berita kosong', description: 'Pesan saat berita belum diterbitkan.', defaultValue: 'Belum ada berita yang diterbitkan.', field: 'text' },
      { key: 'empty.budget', title: 'APBDes kosong', description: 'Pesan saat APBDes belum dipublikasikan.', defaultValue: 'Data APBDes belum dipublikasikan.', field: 'text' },
      { key: 'empty.profileDetail', title: 'Detail profil kosong', description: 'Pesan saat kontak profil belum diisi.', defaultValue: 'Detail profil desa akan ditampilkan setelah dilengkapi oleh admin desa.', field: 'text' },
      { key: 'empty.history', title: 'Sejarah kosong', description: 'Pesan saat sejarah belum diisi.', defaultValue: 'Isi sejarah desa akan ditampilkan setelah dilengkapi oleh admin desa.', field: 'text' },
      { key: 'empty.map', title: 'Peta kosong', description: 'Pesan saat URL peta belum diisi.', defaultValue: 'Peta akan ditampilkan setelah URL embed Google Maps diisi di pengaturan admin.', field: 'text' },
      { key: 'empty.contactAddress', title: 'Alamat kosong', description: 'Fallback alamat kontak.', defaultValue: 'Alamat akan dilengkapi oleh admin desa.', field: 'text' },
      { key: 'empty.contactPhone', title: 'Telepon kosong', description: 'Fallback nomor telepon.', defaultValue: 'Nomor telepon akan dilengkapi oleh admin desa.', field: 'text' },
      { key: 'empty.contactEmail', title: 'Email kosong', description: 'Fallback email kontak.', defaultValue: 'Email akan dilengkapi oleh admin desa.', field: 'text' },
      { key: 'empty.agenda', title: 'Agenda kosong', description: 'Pesan saat agenda belum diterbitkan.', defaultValue: 'Belum ada agenda yang dijadwalkan.', field: 'text' },
      { key: 'empty.gallery', title: 'Galeri kosong', description: 'Pesan saat galeri belum diterbitkan.', defaultValue: 'Belum ada foto yang dipublikasikan. Admin desa dapat menambah dari panel pengelolaan.', field: 'text' },
      { key: 'empty.products', title: 'Produk kosong', description: 'Pesan saat produk belum diterbitkan.', defaultValue: 'Belum ada produk desa yang dipublikasikan.', field: 'text' },
      { key: 'empty.services', title: 'Layanan kosong', description: 'Pesan saat layanan belum diterbitkan.', defaultValue: 'Belum ada layanan yang dipublikasikan.', field: 'text' },
      { key: 'contact.serviceHours', title: 'Jam layanan', description: 'Jam operasional kantor desa.', defaultValue: 'Senin – Jumat, 08.00 – 15.00', field: 'text' },
    ],
  },
  {
    title: 'Profil Desa',
    description: 'Konten halaman profil yang sudah memakai SiteSetting.',
    settings: [
      { key: 'visi', title: 'Visi', description: 'Arah besar pembangunan Desa Cilalawi.', defaultValue: 'Visi desa akan ditampilkan setelah dilengkapi oleh admin.', field: 'textarea' },
      { key: 'misi', title: 'Misi', description: 'Langkah pelayanan dan pembangunan desa.', defaultValue: 'Misi desa akan ditampilkan setelah dilengkapi oleh admin.', field: 'textarea' },
      { key: 'sejarah-desa', title: 'Sejarah Desa', description: 'Cerita asal-usul dan perkembangan desa.', defaultValue: 'Isi sejarah desa akan ditampilkan setelah dilengkapi oleh admin desa.', field: 'textarea' },
    ],
  },
]

export const SITE_SETTINGS = SITE_SETTING_GROUPS.flatMap((group) => group.settings)
export const SITE_SETTING_KEYS = SITE_SETTINGS.map((setting) => setting.key)

export function settingsToMap(rows: SiteSettingInput[]) {
  return new Map(rows.map((row) => [row.key, row.value ?? '']))
}

export function settingValue(settings: Map<string, string>, key: string) {
  const meta = SITE_SETTINGS.find((setting) => setting.key === key)
  const value = settings.get(key)
  return value?.trim() || meta?.defaultValue || ''
}

export async function getSiteSettings(keys: string[]) {
  const rows = await prisma.siteSetting.findMany({ where: { key: { in: keys } } })
  return settingsToMap(rows)
}
