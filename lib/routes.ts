export const publicRoutes = [
  { label: 'Beranda', href: '/' },
  { label: 'Profil Desa', href: '/profil' },
  { label: 'Informasi Desa', href: '/informasi/pengumuman' },
  { label: 'Berita', href: '/berita' },
  { label: 'Layanan', href: '/layanan' },
  { label: 'Galeri', href: '/galeri' },
  { label: 'Produk', href: '/produk' },
  { label: 'Peta', href: '/peta' },
  { label: 'Kontak', href: '/kontak' },
] as const

export const profileRoutes = [
  { label: 'Profil Desa', href: '/profil' },
  { label: 'Aparatur Desa', href: '/profil/aparatur' },
  { label: 'Sejarah Desa', href: '/profil/sejarah' },
  { label: 'Visi & Misi', href: '/profil/visi-misi' },
] as const

export const informationRoutes = [
  { label: 'Pengumuman', href: '/informasi/pengumuman' },
  { label: 'Agenda', href: '/informasi/agenda' },
  { label: 'Data Statistik', href: '/informasi/statistik' },
] as const

export const serviceRoutes = [
  { label: 'Daftar Layanan', href: '/layanan' },
  { label: 'Pengaduan Warga', href: '/layanan/pengaduan' },
] as const

export const adminRoutes = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Profil Desa', href: '/admin/profil' },
  { label: 'Aparatur Desa', href: '/admin/profil/aparatur' },
  { label: 'Pengumuman', href: '/admin/informasi/pengumuman' },
  { label: 'Agenda', href: '/admin/informasi/agenda' },
  { label: 'Statistik', href: '/admin/informasi/statistik' },
  { label: 'Berita', href: '/admin/berita' },
  { label: 'Layanan Warga', href: '/admin/layanan' },
  { label: 'Pengaduan Masuk', href: '/admin/layanan/pengaduan' },
  { label: 'Galeri', href: '/admin/galeri' },
  { label: 'Produk Desa', href: '/admin/produk' },
  { label: 'APBDes', href: '/admin/anggaran' },
  { label: 'Pengaturan Desa', href: '/admin/pengaturan' },
] as const
