import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-40 flex min-h-18 items-center justify-between gap-3 border-b border-emerald-900/10 bg-white/90 px-4 md:px-6 py-3 shadow-sm backdrop-blur-xl md:min-h-20">
      <div className="min-w-0">
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-emerald-700 md:text-xs md:tracking-[0.2em]">Panel Admin</p>
        <h1 className="mt-1 truncate text-lg font-black tracking-tight text-emerald-950 md:text-xl">Kelola Website Desa</h1>
        <p className="mt-1 hidden text-sm text-emerald-950/60 sm:block">Konten, layanan, dan informasi publik Desa Cilalawi.</p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <Button asChild variant="outline" className="hidden rounded-full border-emerald-900/15 bg-white text-emerald-900 hover:bg-emerald-50 sm:inline-flex">
          <Link href="/">Lihat Website</Link>
        </Button>
        <UserButton />
      </div>
    </header>
  )
}
