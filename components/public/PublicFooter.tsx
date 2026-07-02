import Link from 'next/link'
import { informationRoutes, publicRoutes, serviceRoutes } from '@/lib/routes'

export function PublicFooter() {
  return (
    <footer className="mt-20 border-t border-emerald-900/10 bg-emerald-950 text-emerald-50">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.9fr]">
        <div>
          <div className="flex items-center gap-3 font-semibold">
            <span className="grid size-12 place-items-center rounded-2xl bg-white text-base font-black text-emerald-800 shadow-lg">DC</span>
            <span className="leading-tight">
              <span className="block text-lg font-extrabold">Desa Cilalawi</span>
              <span className="block text-xs text-emerald-200">Kecamatan Sukatani, Kabupaten Purwakarta</span>
            </span>
          </div>
          <p className="mt-5 max-w-md text-sm leading-7 text-emerald-100/85">
            Portal resmi desa untuk informasi publik, layanan warga, berita kegiatan, peta wilayah, dan transparansi Pemerintah Desa Cilalawi.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-lime-200">Menu Utama</h2>
          <div className="mt-4 grid gap-3 text-sm">
            {publicRoutes.slice(0, 6).map((route) => (
              <Link key={route.href} href={route.href} className="text-emerald-100/80 transition-colors hover:text-white">
                {route.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-lime-200">Informasi</h2>
          <div className="mt-4 grid gap-3 text-sm">
            {[...informationRoutes, ...serviceRoutes].slice(0, 5).map((route) => (
              <Link key={route.href} href={route.href} className="text-emerald-100/80 transition-colors hover:text-white">
                {route.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-lime-200">Layanan Desa</h2>
          <div className="mt-4 space-y-3 text-sm leading-6 text-emerald-100/80">
            <p>Jam layanan kantor mengikuti hari kerja Pemerintah Desa.</p>
            <Link href="/kontak" className="inline-flex rounded-full border border-white/15 px-4 py-2 font-semibold text-white transition-colors hover:bg-white/10">
              Hubungi Kantor Desa
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-emerald-100/70">
        © 2026 Pemerintah Desa Cilalawi. Dikelola sebagai media informasi dan pelayanan publik desa.
      </div>
    </footer>
  )
}
