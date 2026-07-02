import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export function AnnouncementCard({ title, date, href, summary }: { title: string; date: string; href: string; summary?: string }) {
  return (
    <Link href={href} className="block h-full">
      <Card className="h-full border-emerald-900/10 bg-white shadow-sm shadow-emerald-900/5 transition-all hover:-translate-y-1 hover:border-emerald-700/25 hover:shadow-lg hover:shadow-emerald-900/10">
        <CardHeader className="gap-3">
          <p className="w-fit rounded-full bg-lime-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-emerald-800">{date}</p>
          <CardTitle className="text-lg font-bold leading-snug text-emerald-950">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-6 text-emerald-950/65">{summary ?? 'Informasi ini akan tampil setelah diperbarui oleh admin desa.'}</p>
        </CardContent>
        <CardFooter>
          <p className="text-sm font-bold text-emerald-700">Lihat pengumuman →</p>
        </CardFooter>
      </Card>
    </Link>
  )
}
