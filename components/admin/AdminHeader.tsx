import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-40 flex min-h-20 items-center justify-between gap-4 border-b border-emerald-900/10 bg-white/90 px-6 shadow-sm backdrop-blur-xl">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Panel Admin</p>
        <h1 className="mt-1 text-xl font-black tracking-tight text-emerald-950">Kelola Website Desa</h1>
        <p className="mt-1 hidden text-sm text-emerald-950/60 sm:block">Konten, layanan, dan informasi publik Desa Cilalawi.</p>
      </div>
      <div className="flex items-center gap-3">
        <Button asChild variant="outline" className="hidden rounded-full border-emerald-900/15 bg-white text-emerald-900 hover:bg-emerald-50 sm:inline-flex">
          <Link href="/">Lihat Website</Link>
        </Button>
        <UserButton />
      </div>
    </header>
  )
}
