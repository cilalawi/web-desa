import Link from 'next/link'

const groups = [
  {
    title: 'Utama',
    links: [{ label: 'Dashboard', href: '/admin' }],
  },
  {
    title: 'Profil Desa',
    links: [
      { label: 'Profil Desa', href: '/admin/profil' },
      { label: 'Aparatur Desa', href: '/admin/profil/aparatur' },
    ],
  },
  {
    title: 'Informasi Publik',
    links: [
      { label: 'Pengumuman', href: '/admin/informasi/pengumuman' },
      { label: 'Agenda', href: '/admin/informasi/agenda' },
      { label: 'Statistik', href: '/admin/informasi/statistik' },
      { label: 'Berita', href: '/admin/berita' },
    ],
  },
  {
    title: 'Layanan & Ekonomi',
    links: [
      { label: 'Layanan Warga', href: '/admin/layanan' },
      { label: 'Pengaduan Masuk', href: '/admin/layanan/pengaduan' },
      { label: 'Galeri', href: '/admin/galeri' },
      { label: 'Produk Desa', href: '/admin/produk' },
      { label: 'APBDes', href: '/admin/anggaran' },
    ],
  },
  {
    title: 'Sistem',
    links: [{ label: 'Pengaturan Desa', href: '/admin/pengaturan' }],
  },
]

const adminMobileLinks = groups.flatMap((group) => group.links)

export function AdminMobileNav() {
  return (
    <div className="border-b border-emerald-900/10 bg-emerald-950 px-4 py-3 md:hidden">
      <div className="mb-3 flex items-center gap-3 text-white">
        <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-white text-sm font-black text-emerald-800">DC</span>
        <span className="leading-tight">
          <span className="block text-sm font-extrabold">Admin Desa Cilalawi</span>
          <span className="block text-xs text-emerald-100/75">Panel Website Resmi</span>
        </span>
      </div>
      <nav className="flex gap-2 overflow-x-auto pb-1 text-sm font-semibold text-emerald-50/90">
        {adminMobileLinks.map((route) => (
          <Link key={route.href} href={route.href} className="shrink-0 rounded-full bg-white/10 px-4 py-2.5 ring-1 ring-white/10 transition-colors hover:bg-white hover:text-emerald-950">
            {route.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}

export function AdminSidebar() {
  return (
    <aside className="hidden border-r border-emerald-900/10 bg-emerald-950 px-4 py-5 text-white md:sticky md:top-0 md:flex md:h-screen md:flex-col md:overflow-y-auto">
      <Link href="/admin" className="flex items-center gap-3 rounded-[1.5rem] bg-white/10 p-3 ring-1 ring-white/10 transition-colors hover:bg-white/15">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white text-base font-black text-emerald-800 shadow-lg">DC</span>
        <span className="leading-tight">
          <span className="block text-base font-extrabold">Admin Desa Cilalawi</span>
          <span className="block text-xs font-medium text-emerald-100/75">Panel Website Resmi</span>
        </span>
      </Link>

      <nav className="mt-6 grid gap-6 text-sm">
        {groups.map((group) => (
          <section key={group.title} className="grid gap-2">
            <p className="px-3 text-[0.68rem] font-black uppercase tracking-[0.22em] text-lime-200/90">{group.title}</p>
            <div className="grid gap-1">
              {group.links.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className="rounded-2xl px-3 py-2.5 font-semibold text-emerald-50/85 transition-all hover:bg-white hover:text-emerald-950 hover:shadow-lg hover:shadow-emerald-950/20 focus-visible:bg-white focus-visible:text-emerald-950"
                >
                  {route.label}
                </Link>
              ))}
            </div>
          </section>
        ))}
      </nav>

      <div className="mt-auto pt-6">
        <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-4 text-sm text-emerald-50/80">
          <p className="font-bold text-white">Website Desa</p>
          <p className="mt-2 leading-6">Lihat tampilan publik setelah memperbarui konten.</p>
          <Link href="/" className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-xs font-bold text-emerald-900 transition-colors hover:bg-emerald-50">
            Buka Website
          </Link>
        </div>
      </div>
    </aside>
  )
}
