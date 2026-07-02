import 'dotenv/config'
import { PrismaClient, ContentStatus, MediaPurpose } from '../app/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  await prisma.villageProfile.upsert({
    where: { name: 'Desa Cilalawi' },
    update: {
      tagline: 'Website resmi Desa Cilalawi',
      description: 'Pusat informasi, layanan warga, pengumuman, dan transparansi publik Desa Cilalawi.',
    },
    create: {
      name: 'Desa Cilalawi',
      tagline: 'Website resmi Desa Cilalawi',
      description: 'Pusat informasi, layanan warga, pengumuman, dan transparansi publik Desa Cilalawi.',
    },
  })

  const siteSettings = [
    { key: 'home.hero.title', value: 'Website Desa Cilalawi', description: 'Judul besar di hero beranda.' },
    { key: 'home.hero.primaryCtaLabel', value: 'Ajukan Pengaduan', description: 'Teks tombol pengaduan di hero.' },
    { key: 'home.hero.primaryCtaHref', value: '/layanan/pengaduan', description: 'Tujuan tombol utama.' },
    { key: 'home.hero.secondaryCtaLabel', value: 'Lihat Pengumuman', description: 'Teks tombol pengumuman di hero.' },
    { key: 'home.hero.secondaryCtaHref', value: '/informasi/pengumuman', description: 'Tujuan tombol kedua.' },
    { key: 'home.hero.imageUrl', value: '/pemandangan.jpeg', description: 'Path gambar hero.' },
    { key: 'home.hero.imageAlt', value: 'Pemandangan Desa Cilalawi', description: 'Teks alternatif gambar hero.' },
    { key: 'home.services.eyebrow', value: 'Layanan', description: 'Label kecil section layanan.' },
    { key: 'home.services.title', value: 'Akses layanan desa lebih jelas', description: 'Judul section layanan.' },
    { key: 'home.services.description', value: 'Warga dapat menemukan kanal pengaduan, pengumuman, dan informasi publik tanpa harus mencari dari banyak tempat.', description: 'Deskripsi section layanan.' },
    { key: 'home.announcements.eyebrow', value: 'Pengumuman', description: 'Label kecil section pengumuman.' },
    { key: 'home.announcements.title', value: 'Informasi resmi dari pemerintah desa', description: 'Judul section pengumuman.' },
    { key: 'home.announcements.description', value: 'Pengumuman dan agenda desa disusun agar warga dapat melihat informasi terbaru dari satu halaman.', description: 'Deskripsi section pengumuman.' },
    { key: 'home.welcome.eyebrow', value: 'Sambutan', description: 'Label kecil section sambutan.' },
    { key: 'home.welcome.title', value: 'Pemerintah Desa Cilalawi', description: 'Judul besar section sambutan.' },
    { key: 'home.welcome.heading', value: 'Pelayanan publik yang terbuka dan mudah diakses', description: 'Kalimat tebal section sambutan.' },
    { key: 'home.welcome.body', value: 'Website ini disiapkan sebagai ruang informasi resmi, kanal layanan warga, dan media transparansi desa.', description: 'Isi pendek section sambutan.' },
    { key: 'home.news.eyebrow', value: 'Berita', description: 'Label kecil section berita.' },
    { key: 'home.news.title', value: 'Kabar Desa Cilalawi', description: 'Judul section berita.' },
    { key: 'home.news.description', value: 'Publikasi kegiatan, program, dan potensi desa dikelola agar warga dapat mengikuti perkembangan terbaru.', description: 'Deskripsi section berita.' },
    { key: 'home.budget.eyebrow', value: 'Transparansi', description: 'Label kecil section APBDes.' },
    { key: 'home.budget.title', value: 'APBDes siap dipublikasikan', description: 'Judul section APBDes.' },
    { key: 'home.budget.description', value: 'Data anggaran ditampilkan setelah diverifikasi oleh admin desa agar informasi yang tampil tetap akurat.', description: 'Deskripsi section APBDes.' },
    { key: 'home.services.imageUrl', value: '/art/civic-services.svg', description: 'Path gambar layanan.' },
    { key: 'home.services.imageAlt', value: 'Ilustrasi layanan warga Desa Cilalawi', description: 'Teks alternatif gambar layanan.' },
    { key: 'home.budget.imageUrl', value: '/art/transparent-budget.svg', description: 'Path gambar APBDes.' },
    { key: 'home.budget.imageAlt', value: 'Ilustrasi transparansi APBDes Desa Cilalawi', description: 'Teks alternatif gambar APBDes.' },
    { key: 'empty.statistics', value: 'Data statistik belum tersedia.', description: 'Pesan saat statistik belum tersedia.' },
    { key: 'empty.announcements', value: 'Belum ada pengumuman yang diterbitkan.', description: 'Pesan saat pengumuman belum diterbitkan.' },
    { key: 'empty.news', value: 'Belum ada berita yang diterbitkan.', description: 'Pesan saat berita belum diterbitkan.' },
    { key: 'empty.budget', value: 'Data APBDes belum dipublikasikan.', description: 'Pesan saat APBDes belum dipublikasikan.' },
    { key: 'empty.profileDetail', value: 'Detail profil desa akan ditampilkan setelah dilengkapi oleh admin desa.', description: 'Pesan saat kontak profil belum diisi.' },
    { key: 'empty.history', value: 'Isi sejarah desa akan ditampilkan setelah dilengkapi oleh admin desa.', description: 'Pesan saat sejarah belum diisi.' },
    { key: 'empty.map', value: 'Peta akan ditampilkan setelah URL embed Google Maps diisi di pengaturan admin.', description: 'Pesan saat URL peta belum diisi.' },
    { key: 'empty.contactAddress', value: 'Alamat akan dilengkapi oleh admin desa.', description: 'Fallback alamat kontak.' },
    { key: 'empty.contactPhone', value: 'Nomor telepon akan dilengkapi oleh admin desa.', description: 'Fallback nomor telepon.' },
    { key: 'empty.contactEmail', value: 'Email akan dilengkapi oleh admin desa.', description: 'Fallback email kontak.' },
    { key: 'empty.agenda', value: 'Belum ada agenda yang dijadwalkan.', description: 'Pesan saat agenda belum diterbitkan.' },
    { key: 'empty.gallery', value: 'Belum ada foto yang dipublikasikan. Admin desa dapat menambah dari panel pengelolaan.', description: 'Pesan saat galeri belum diterbitkan.' },
    { key: 'empty.products', value: 'Belum ada produk desa yang dipublikasikan.', description: 'Pesan saat produk belum diterbitkan.' },
    { key: 'empty.services', value: 'Belum ada layanan yang dipublikasikan.', description: 'Pesan saat layanan belum diterbitkan.' },
    { key: 'contact.serviceHours', value: 'Senin – Jumat, 08.00 – 15.00', description: 'Jam operasional kantor desa.' },
    { key: 'visi', value: 'Visi desa akan ditampilkan setelah dilengkapi oleh admin.', description: 'Arah besar pembangunan Desa Cilalawi.' },
    { key: 'misi', value: 'Misi desa akan ditampilkan setelah dilengkapi oleh admin.', description: 'Langkah pelayanan dan pembangunan desa.' },
    { key: 'sejarah-desa', value: 'Isi sejarah desa akan ditampilkan setelah dilengkapi oleh admin desa.', description: 'Cerita asal-usul dan perkembangan desa.' },
  ]

  for (const setting of siteSettings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: setting,
      create: setting,
    })
  }

  await prisma.mediaAsset.upsert({
    where: { id: 'cilalawi-hero-art' },
    update: {
      url: '/art/cilalawi-hero.svg',
      alt: 'Ilustrasi lanskap Desa Cilalawi',
      purpose: MediaPurpose.COVER,
    },
    create: {
      id: 'cilalawi-hero-art',
      url: '/art/cilalawi-hero.svg',
      alt: 'Ilustrasi lanskap Desa Cilalawi',
      purpose: MediaPurpose.COVER,
    },
  })

  const services = [
    {
      title: 'Pengaduan warga',
      slug: 'pengaduan-warga',
      description: 'Warga dapat menyampaikan laporan awal untuk ditindaklanjuti perangkat desa.',
      order: 1,
    },
    {
      title: 'Informasi desa',
      slug: 'informasi-desa',
      description: 'Pengumuman, agenda, dan berita desa disusun dalam satu alur baca yang jelas.',
      order: 2,
    },
    {
      title: 'Transparansi publik',
      slug: 'transparansi-publik',
      description: 'Ringkasan APBDes disiapkan agar mudah dipublikasikan setelah data diverifikasi.',
      order: 3,
    },
  ]

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: { ...service, status: ContentStatus.PUBLISHED },
      create: { ...service, status: ContentStatus.PUBLISHED },
    })
  }

  const announcements = [
    'Jadwal layanan kantor desa',
    'Informasi kegiatan masyarakat',
    'Pengumuman administrasi warga',
  ]

  for (const [index, title] of announcements.entries()) {
    const slug = title.toLowerCase().replaceAll(' ', '-')
    await prisma.announcement.upsert({
      where: { slug },
      update: {
        title,
        summary: 'Informasi ini akan tampil setelah diperbarui oleh admin desa.',
        body: 'Konten pengumuman dapat dikelola dari halaman admin setelah modul pengelolaan aktif.',
        status: ContentStatus.PUBLISHED,
        publishedAt: new Date(),
      },
      create: {
        title,
        slug,
        summary: 'Informasi ini akan tampil setelah diperbarui oleh admin desa.',
        body: 'Konten pengumuman dapat dikelola dari halaman admin setelah modul pengelolaan aktif.',
        status: ContentStatus.PUBLISHED,
        publishedAt: new Date(Date.now() - index * 86_400_000),
      },
    })
  }

  const news = [
    {
      title: 'Kabar Pemerintahan Desa',
      slug: 'kabar-pemerintahan-desa',
      excerpt: 'Ruang publikasi untuk keputusan, program, dan kegiatan Pemerintah Desa Cilalawi.',
    },
    {
      title: 'Kegiatan Masyarakat',
      slug: 'kegiatan-masyarakat',
      excerpt: 'Dokumentasi agenda warga, gotong royong, pelatihan, dan aktivitas sosial desa.',
    },
    {
      title: 'Potensi Desa',
      slug: 'potensi-desa',
      excerpt: 'Cerita tentang produk lokal, ekonomi warga, dan peluang pengembangan Desa Cilalawi.',
    },
  ]

  for (const item of news) {
    await prisma.news.upsert({
      where: { slug: item.slug },
      update: { ...item, body: item.excerpt, status: ContentStatus.PUBLISHED, publishedAt: new Date() },
      create: { ...item, body: item.excerpt, status: ContentStatus.PUBLISHED, publishedAt: new Date() },
    })
  }

  const statistics = [
    { label: 'Profil wilayah', value: 'Siap diisi', order: 1 },
    { label: 'Data penduduk', value: 'Verifikasi', order: 2 },
    { label: 'Layanan warga', value: 'Aktif', order: 3 },
    { label: 'Transparansi', value: 'Terjadwal', order: 4 },
  ]

  for (const stat of statistics) {
    await prisma.statistic.upsert({
      where: { id: `seed-stat-${stat.order}` },
      update: { ...stat, status: ContentStatus.PUBLISHED },
      create: { id: `seed-stat-${stat.order}`, ...stat, status: ContentStatus.PUBLISHED },
    })
  }

  const budgetItems = [
    { label: 'Pendapatan Desa', value: 'Siap diisi dari admin', order: 1 },
    { label: 'Belanja Desa', value: 'Menunggu verifikasi', order: 2 },
    { label: 'Program Prioritas', value: 'Dikelola pemerintah desa', order: 3 },
  ]

  for (const item of budgetItems) {
    await prisma.budgetItem.upsert({
      where: { id: `seed-budget-${item.order}` },
      update: { ...item, year: 2026, description: item.value, status: ContentStatus.PUBLISHED },
      create: { id: `seed-budget-${item.order}`, ...item, year: 2026, description: item.value, status: ContentStatus.PUBLISHED },
    })
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect()
  })
