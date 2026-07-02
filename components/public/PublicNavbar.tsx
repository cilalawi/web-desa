import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { publicRoutes } from '@/lib/routes'

const featuredRoutes = publicRoutes.slice(0, 7)

export function PublicNavbar() {
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

        <div className="flex shrink-0 items-center gap-2 text-sm">
          <Button asChild variant="ghost" className="hidden h-10 rounded-full px-3 text-emerald-900 hover:bg-emerald-50 sm:inline-flex">
            <Link href="/admin" prefetch={false}>Admin</Link>
          </Button>
          <Button asChild className="h-11 rounded-full bg-emerald-700 px-5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/15 hover:bg-emerald-800">
            <Link href="/layanan/pengaduan">Ajukan Pengaduan</Link>
          </Button>
        </div>
      </nav>
      <div className="border-t border-emerald-900/10 bg-white/90 lg:hidden">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 text-sm font-medium text-emerald-900">
          {publicRoutes.map((route) => (
            <Link key={route.href} href={route.href} className="shrink-0 rounded-full bg-emerald-50 px-3 py-2 hover:bg-emerald-100">
              {route.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}
