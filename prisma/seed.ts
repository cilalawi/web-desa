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
      description: 'Desa Cilalawi merupakan salah satu desa yang berada di Kecamatan Sukatani, Kabupaten Purwakarta, Provinsi Jawa Barat. Dengan luas wilayah sekitar 150 hektare, Desa Cilalawi terdiri atas 2 dusun, 5 RW, dan 14 RT. Letaknya yang strategis serta didukung akses menuju jalur utama menjadikan desa ini memiliki potensi yang baik dalam pengembangan sektor perdagangan, pertanian, dan usaha mikro, kecil, dan menengah (UMKM). masyarakat desa cilalawi masyarakat masih menjunjung tinggi nilai gotong royong, kebersamaan, dan kehidupan sosial yang harmonis. Berbagai kegiatan kemasyarakatan, keagamaan, serta pelestarian budaya lokal terus dilaksanakan sebagai bagian dari upaya memperkuat persatuan dan meningkatkan kesejahteraan masyarakat. Melalui website resmi ini, Pemerintah Desa Cilalawi berkomitmen menyajikan informasi yang akurat, transparan, dan mudah diakses oleh seluruh masyarakat sebagai wujud pelayanan publik yang lebih baik.',
    },
    create: {
      name: 'Desa Cilalawi',
      tagline: 'Website resmi Desa Cilalawi',
      description: 'Desa Cilalawi merupakan salah satu desa yang berada di Kecamatan Sukatani, Kabupaten Purwakarta, Provinsi Jawa Barat. Dengan luas wilayah sekitar 150 hektare, Desa Cilalawi terdiri atas 2 dusun, 5 RW, dan 14 RT. Letaknya yang strategis serta didukung akses menuju jalur utama menjadikan desa ini memiliki potensi yang baik dalam pengembangan sektor perdagangan, pertanian, dan usaha mikro, kecil, dan menengah (UMKM). masyarakat desa cilalawi masyarakat masih menjunjung tinggi nilai gotong royong, kebersamaan, dan kehidupan sosial yang harmonis. Berbagai kegiatan kemasyarakatan, keagamaan, serta pelestarian budaya lokal terus dilaksanakan sebagai bagian dari upaya memperkuat persatuan dan meningkatkan kesejahteraan masyarakat. Melalui website resmi ini, Pemerintah Desa Cilalawi berkomitmen menyajikan informasi yang akurat, transparan, dan mudah diakses oleh seluruh masyarakat sebagai wujud pelayanan publik yang lebih baik.',
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
    // Umum
    { label: 'Luas Wilayah', value: '284,14 Ha', category: 'Umum', order: 1 },
    { label: 'Total Penduduk', value: '5.450 Jiwa', category: 'Umum', order: 2 },
    { label: 'Jumlah Kepala Keluarga (KK)', value: '1.637 KK', category: 'Umum', order: 3 },
    { label: 'Penduduk Laki-laki', value: '2.766 Jiwa', category: 'Umum', order: 4 },
    { label: 'Penduduk Perempuan', value: '2.684 Jiwa', category: 'Umum', order: 5 },

    // Batas Wilayah
    { label: 'Batas Utara', value: 'Desa Sukajaya', category: 'Batas Wilayah', order: 6 },
    { label: 'Batas Selatan', value: 'Desa Malangnengah', category: 'Batas Wilayah', order: 7 },
    { label: 'Batas Barat', value: 'Desa Cibodas', category: 'Batas Wilayah', order: 8 },
    { label: 'Batas Timur', value: 'Desa Sukatani', category: 'Batas Wilayah', order: 9 },

    // Agama
    { label: 'Agama Islam', value: '5.437 Jiwa', category: 'Agama', order: 10 },
    { label: 'Agama Protestan', value: '5 Jiwa', category: 'Agama', order: 11 },
    { label: 'Agama Katolik', value: '2 Jiwa', category: 'Agama', order: 12 },
    { label: 'Agama Hindu', value: '0 Jiwa', category: 'Agama', order: 13 },
    { label: 'Agama Buddha', value: '6 Jiwa', category: 'Agama', order: 14 },
    { label: 'Agama Khonghucu', value: '0 Jiwa', category: 'Agama', order: 15 },

    // Kelompok Usia
    { label: 'Usia 0 - 4 tahun', value: '440 Jiwa', category: 'Kelompok Usia', order: 16 },
    { label: 'Usia 5 - 9 tahun', value: '468 Jiwa', category: 'Kelompok Usia', order: 17 },
    { label: 'Usia 10 - 14 tahun', value: '512 Jiwa', category: 'Kelompok Usia', order: 18 },
    { label: 'Usia 15 - 19 tahun', value: '494 Jiwa', category: 'Kelompok Usia', order: 19 },
    { label: 'Usia 20 - 24 tahun', value: '486 Jiwa', category: 'Kelompok Usia', order: 20 },
    { label: 'Usia 25 - 29 tahun', value: '432 Jiwa', category: 'Kelompok Usia', order: 21 },
    { label: 'Usia 30 - 34 tahun', value: '395 Jiwa', category: 'Kelompok Usia', order: 22 },
    { label: 'Usia 35 - 39 tahun', value: '367 Jiwa', category: 'Kelompok Usia', order: 23 },
    { label: 'Usia 40 - 44 tahun', value: '374 Jiwa', category: 'Kelompok Usia', order: 24 },
    { label: 'Usia 45 - 49 tahun', value: '337 Jiwa', category: 'Kelompok Usia', order: 25 },
    { label: 'Usia 50 - 54 tahun', value: '308 Jiwa', category: 'Kelompok Usia', order: 26 },
    { label: 'Usia 55 - 59 tahun', value: '260 Jiwa', category: 'Kelompok Usia', order: 27 },
    { label: 'Usia 60 - 64 tahun', value: '201 Jiwa', category: 'Kelompok Usia', order: 28 },
    { label: 'Usia 65 - 69 tahun', value: '161 Jiwa', category: 'Kelompok Usia', order: 29 },
    { label: 'Usia 70 - 74 tahun', value: '110 Jiwa', category: 'Kelompok Usia', order: 30 },
    { label: 'Usia 75 tahun ke atas', value: '105 Jiwa', category: 'Kelompok Usia', order: 31 },

    // Sarana Pendidikan
    { label: 'Pendidikan PAUD', value: '4 Unit', category: 'Pendidikan', order: 32 },
    { label: 'Pendidikan TK', value: '2 Unit', category: 'Pendidikan', order: 33 },
    { label: 'Pendidikan SD', value: '3 Unit', category: 'Pendidikan', order: 34 },
    { label: 'Pendidikan SMP', value: '1 Unit', category: 'Pendidikan', order: 35 },
    { label: 'Pendidikan MDT', value: '5 Unit', category: 'Pendidikan', order: 36 },
    { label: 'Pendidikan Ponpes', value: '4 Unit', category: 'Pendidikan', order: 37 },

    // Sarana Kesehatan
    { label: 'Kesehatan Pustu', value: '1 Unit', category: 'Kesehatan', order: 38 },
    { label: 'Kesehatan Posyandu', value: '7 Unit', category: 'Kesehatan', order: 39 },

    // Sarana Keagamaan
    { label: 'Keagamaan Mesjid', value: '11 Unit', category: 'Keagamaan', order: 40 },
    { label: 'Keagamaan Mushola', value: '17 Unit', category: 'Keagamaan', order: 41 },
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
