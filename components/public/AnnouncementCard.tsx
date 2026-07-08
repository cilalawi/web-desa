import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export function AnnouncementCard({ title, date, href, summary }: { title: string; date: string; href: string; summary?: string }) {
  return (
    <Link href={href} className="block h-full">
      <Card className="h-full border-emerald-900/10 bg-white shadow-sm shadow-emerald-900/5 transition-all hover:-translate-y-1 hover:border-emerald-700/25 hover:shadow-lg hover:shadow-emerald-900/10">
        <CardHeader className="gap-2 md:gap-3">
          <p className="w-fit rounded-full bg-lime-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-800 md:px-3 md:text-xs md:tracking-[0.16em]">{date}</p>
          <CardTitle className="text-base font-bold leading-snug text-emerald-950 md:text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs leading-5 text-emerald-950/65 md:text-sm md:leading-6">{summary ?? 'Informasi ini akan tampil setelah diperbarui oleh admin desa.'}</p>
        </CardContent>
        <CardFooter>
          <p className="text-xs font-bold text-emerald-700 md:text-sm">Lihat pengumuman →</p>
        </CardFooter>
      </Card>
    </Link>
  )
}
