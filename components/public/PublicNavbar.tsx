'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { publicRoutes } from '@/lib/routes'
import { cn } from '@/lib/utils'

const featuredRoutes = publicRoutes.slice(0, 7)

const mobileRouteGroups = [
  {
    title: 'Utama',
    links: [
      { label: 'Beranda', href: '/' },
      { label: 'Galeri', href: '/galeri' },
      { label: 'Produk', href: '/produk' },
      { label: 'Peta', href: '/peta' },
      { label: 'Kontak', href: '/kontak' },
    ],
  },
  {
    title: 'Profil Desa',
    links: [
      { label: 'Profil Desa', href: '/profil' },
      { label: 'Aparatur', href: '/profil/aparatur' },
      { label: 'Sejarah', href: '/profil/sejarah' },
      { label: 'Visi & Misi', href: '/profil/visi-misi' },
    ],
  },
  {
    title: 'Informasi & Layanan',
    links: [
      { label: 'Pengumuman', href: '/informasi/pengumuman' },
      { label: 'Agenda', href: '/informasi/agenda' },
      { label: 'Statistik', href: '/informasi/statistik' },
      { label: 'Layanan', href: '/layanan' },
      { label: 'Pengaduan', href: '/layanan/pengaduan' },
    ],
  },
] as const

export function PublicNavbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const closeDrawer = () => setIsOpen(false)
  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeDrawer()
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-emerald-900/10 bg-white/95 shadow-sm backdrop-blur-xl">
      <div className="hidden border-b border-emerald-900/10 bg-emerald-800 text-white md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-xs font-medium">
          <p className="uppercase tracking-[0.18em]">Website Resmi Pemerintah Desa Cilalawi</p>
          <div className="flex items-center gap-4 text-emerald-50">
            <span>Kec. Sukatani, Kab. Purwakarta</span>
            <span className="h-1 w-1 rounded-full bg-emerald-200" />
            <Link href="/kontak" className="transition-colors hover:text-white/80">Kontak Desa</Link>
          </div>
        </div>
      </div>
      <nav className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 px-4 py-2.5 md:min-h-20 md:gap-4 md:py-3">
        <Link href="/" className="flex min-w-0 items-center gap-2.5 text-emerald-950 md:gap-3">
          <img
            src="/image.png"
            alt="Desa Cilalawi"
            className="size-10 shrink-0 rounded-2xl object-cover shadow-md shadow-emerald-900/10 ring-1 ring-white/70 md:size-12 md:shadow-lg md:shadow-emerald-900/15"
          />
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-base font-extrabold tracking-tight md:text-lg">Desa Cilalawi</span>
            <span className="hidden truncate text-xs font-medium text-emerald-700 sm:block">Portal layanan dan informasi desa</span>
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
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-emerald-900/10 bg-white text-emerald-950 shadow-sm transition-colors hover:bg-emerald-50 lg:hidden"
        >
          <span className="relative h-3.5 w-5">
            <span className={cn('absolute left-0 top-0 h-0.5 w-5 rounded-full bg-current transition-transform', isOpen && 'translate-y-[6px] rotate-45')} />
            <span className={cn('absolute left-0 top-1.5 h-0.5 w-5 rounded-full bg-current transition-opacity', isOpen ? 'opacity-0' : 'opacity-100')} />
            <span className={cn('absolute left-0 top-3 h-0.5 w-5 rounded-full bg-current transition-transform', isOpen && '-translate-y-[6px] -rotate-45')} />
          </span>
        </button>
      </nav>

      </header>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            className="fixed inset-0 z-[100] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
          >
            <button
              type="button"
              aria-label="Tutup menu navigasi"
              className="absolute inset-0 bg-emerald-950/45 backdrop-blur-sm"
              onClick={closeDrawer}
            />
            <motion.aside
              id="mobile-navigation-drawer"
              aria-label="Menu navigasi utama"
              className="absolute right-0 top-0 flex h-full w-[19rem] max-w-[86vw] flex-col overflow-hidden bg-white shadow-2xl shadow-emerald-950/20"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 36 }}
            >
              <div className="border-b border-emerald-900/10 px-4 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-extrabold tracking-tight text-emerald-950">Menu Desa Cilalawi</p>
                    <p className="mt-0.5 text-xs font-medium text-emerald-800/65">Navigasi portal warga</p>
                  </div>
                  <button
                    type="button"
                    aria-label="Tutup menu"
                    onClick={closeDrawer}
                    className="grid size-10 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-950 transition-colors hover:bg-emerald-100"
                  >
                    <span className="relative block size-4">
                      <span className="absolute left-0 top-1/2 h-0.5 w-4 -translate-y-1/2 rotate-45 rounded-full bg-current" />
                      <span className="absolute left-0 top-1/2 h-0.5 w-4 -translate-y-1/2 -rotate-45 rounded-full bg-current" />
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-3 py-3">
                <div className="space-y-4">
                  {mobileRouteGroups.map((group) => (
                    <div key={group.title}>
                      <p className="px-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700/75">{group.title}</p>
                      <div className="mt-1.5 overflow-hidden rounded-2xl border border-emerald-900/10 bg-white">
                        {group.links.map((route) => (
                          <Link
                            key={route.href}
                            href={route.href}
                            onClick={closeDrawer}
                            className={cn(
                              'flex min-h-11 items-center justify-between border-b border-emerald-900/10 px-3 text-sm font-semibold text-emerald-950 transition-colors last:border-b-0 hover:bg-emerald-50',
                              isActive(route.href) && 'bg-emerald-50 text-emerald-800'
                            )}
                          >
                            {route.label}
                            <span aria-hidden className="text-emerald-700/60">›</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-emerald-900/10 bg-white p-3">
                <Button asChild className="h-11 w-full rounded-full bg-emerald-700 text-sm font-semibold text-white shadow-md shadow-emerald-900/10 hover:bg-emerald-800">
                  <Link href="/layanan/pengaduan" onClick={closeDrawer}>Ajukan Pengaduan</Link>
                </Button>
                <Button asChild variant="ghost" className="mt-2 h-10 w-full rounded-full text-sm text-emerald-900 hover:bg-emerald-50">
                  <Link href="/admin" prefetch={false} onClick={closeDrawer}>Masuk Admin</Link>
                </Button>
              </div>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
