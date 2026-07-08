'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { publicRoutes } from '@/lib/routes'

const featuredRoutes = publicRoutes.slice(0, 7)

const mobileRouteGroups = [
  { label: 'Beranda', href: '/' },
  {
    label: 'Profil Desa',
    href: '/profil',
    children: [
      { label: 'Aparatur', href: '/profil/aparatur' },
      { label: 'Sejarah', href: '/profil/sejarah' },
      { label: 'Visi & Misi', href: '/profil/visi-misi' },
    ],
  },
  {
    label: 'Informasi',
    href: '/informasi/pengumuman',
    children: [
      { label: 'Pengumuman', href: '/informasi/pengumuman' },
      { label: 'Agenda', href: '/informasi/agenda' },
      { label: 'Statistik', href: '/informasi/statistik' },
    ],
  },
  {
    label: 'Layanan',
    href: '/layanan',
    children: [
      { label: 'Daftar Layanan', href: '/layanan' },
      { label: 'Pengaduan', href: '/layanan/pengaduan' },
    ],
  },
  { label: 'Galeri', href: '/galeri' },
  { label: 'Produk', href: '/produk' },
  { label: 'Peta', href: '/peta' },
  { label: 'Kontak', href: '/kontak' },
] as const

export function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false)

  const closeDrawer = () => setIsOpen(false)

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-900/10 bg-white/95 shadow-sm backdrop-blur-xl">
      <div className="border-b border-emerald-900/10 bg-emerald-800 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-xs font-medium">
          <p className="uppercase tracking-[0.18em]">Website Resmi Pemerintah Desa Cilalawi</p>
          <div className="hidden items-center gap-4 text-emerald-50 md:flex">
            <span>Kec. Sukatani, Kab. Purwakarta</span>
            <span className="h-1 w-1 rounded-full bg-emerald-200" />
            <Link href="/kontak" className="transition-colors hover:text-white/80">Kontak Desa</Link>
          </div>
        </div>
      </div>
      <nav className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex min-w-0 items-center gap-3 text-emerald-950">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-700 to-lime-600 text-base font-black text-white shadow-lg shadow-emerald-900/15 ring-1 ring-white/70">
            DC
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-lg font-extrabold tracking-tight">Desa Cilalawi</span>
            <span className="block truncate text-xs font-medium text-emerald-700">Portal layanan dan informasi desa</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-emerald-900/10 bg-emerald-50/80 p-1 text-sm font-medium text-emerald-900 shadow-inner lg:flex">
          {featuredRoutes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="rounded-full px-3 py-2 transition-colors hover:bg-white hover:text-emerald-800 hover:shadow-sm"
            >
              {route.label}
            </Link>
          ))}
        </div>

        <div className="hidden shrink-0 items-center gap-2 text-sm lg:flex">
          <Button asChild variant="ghost" className="h-10 rounded-full px-3 text-emerald-900 hover:bg-emerald-50">
            <Link href="/admin" prefetch={false}>Admin</Link>
          </Button>
          <Button asChild className="h-11 rounded-full bg-emerald-700 px-5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/15 hover:bg-emerald-800">
            <Link href="/layanan/pengaduan">Ajukan Pengaduan</Link>
          </Button>
        </div>

        <button
          type="button"
          aria-label={isOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation-drawer"
          onClick={() => setIsOpen((open) => !open)}
          className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-900/10 bg-emerald-50 text-emerald-950 shadow-sm transition-colors hover:bg-emerald-100 lg:hidden"
        >
          <span className="relative h-4 w-5">
            <span className={`absolute left-0 top-0 h-0.5 w-5 rounded-full bg-current transition-transform ${isOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
            <span className={`absolute left-0 top-[7px] h-0.5 w-5 rounded-full bg-current transition-opacity ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
            <span className={`absolute left-0 top-3.5 h-0.5 w-5 rounded-full bg-current transition-transform ${isOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
          </span>
        </button>
      </nav>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            className="fixed inset-0 z-[60] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <button
              type="button"
              aria-label="Tutup menu navigasi"
              className="absolute inset-0 bg-emerald-950/40 backdrop-blur-sm"
              onClick={closeDrawer}
            />
            <motion.aside
              id="mobile-navigation-drawer"
              aria-label="Menu navigasi utama"
              className="absolute right-0 top-0 flex h-full w-72 max-w-[82vw] flex-col overflow-hidden bg-white shadow-2xl shadow-emerald-950/20"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 360, damping: 34 }}
            >
              <div className="border-b border-emerald-900/10 bg-gradient-to-br from-emerald-50 via-white to-lime-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 text-emerald-950">
                    <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-700 to-lime-600 text-xs font-black text-white shadow-lg shadow-emerald-900/15">
                      DC
                    </span>
                    <div>
                      <p className="text-sm font-extrabold tracking-tight">Desa Cilalawi</p>
                      <p className="mt-0.5 text-[11px] font-medium text-emerald-800/70">Menu layanan warga</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label="Tutup menu"
                    onClick={closeDrawer}
                    className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-emerald-950 shadow-sm ring-1 ring-emerald-900/10 transition-colors hover:bg-emerald-50"
                  >
                    <span className="relative block size-4">
                      <span className="absolute left-0 top-1/2 h-0.5 w-4 -translate-y-1/2 rotate-45 rounded-full bg-current" />
                      <span className="absolute left-0 top-1/2 h-0.5 w-4 -translate-y-1/2 -rotate-45 rounded-full bg-current" />
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-3 py-3.5">
                <div className="space-y-2">
                  {mobileRouteGroups.map((route) => (
                    <div key={route.href} className="rounded-[1.1rem] border border-emerald-900/10 bg-white p-1.5 shadow-sm shadow-emerald-900/5">
                      <Link
                        href={route.href}
                        onClick={closeDrawer}
                        className="flex items-center justify-between rounded-xl px-2.5 py-2 text-[13px] font-extrabold text-emerald-950 transition-colors hover:bg-emerald-50"
                      >
                        {route.label}
                        <span aria-hidden className="text-emerald-700">→</span>
                      </Link>
                      {'children' in route ? (
                        <div className="mt-1 grid gap-0.5 border-t border-emerald-900/10 px-1.5 py-1.5">
                          {route.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={closeDrawer}
                              className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-emerald-950/70 transition-colors hover:bg-emerald-50 hover:text-emerald-900"
                            >
                              <span className="size-1 rounded-full bg-emerald-500" />
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-emerald-900/10 bg-emerald-50/70 p-3">
                <Button asChild className="h-10 w-full rounded-full bg-emerald-700 text-xs font-semibold text-white shadow-lg shadow-emerald-900/15 hover:bg-emerald-800">
                  <Link href="/layanan/pengaduan" onClick={closeDrawer}>Ajukan Pengaduan</Link>
                </Button>
                <Button asChild variant="ghost" className="mt-1.5 h-9 w-full rounded-full text-xs text-emerald-900 hover:bg-white">
                  <Link href="/admin" prefetch={false} onClick={closeDrawer}>Masuk Admin</Link>
                </Button>
              </div>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
