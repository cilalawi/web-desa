import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

type NewsImage = { url: string; alt: string }

export function NewsCard({ title, slug, excerpt, image }: { title: string; slug: string; excerpt: string; image?: NewsImage | null }) {
  return (
    <Link href={`/berita/${slug}`} className="block h-full">
      <Card className="h-full border-emerald-900/10 bg-white shadow-sm shadow-emerald-900/5 transition-all hover:-translate-y-1 hover:border-emerald-700/25 hover:shadow-lg hover:shadow-emerald-900/10">
        {image ? (
          <Image src={image.url} alt={image.alt} width={640} height={420} className="aspect-video w-full object-cover" />
        ) : null}
        <CardHeader className="gap-3">
          <p className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">Kabar Desa</p>
          <CardTitle className="text-lg font-bold leading-snug text-emerald-950">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-6 text-emerald-950/65">{excerpt}</p>
        </CardContent>
        <CardFooter>
          <p className="text-sm font-bold text-emerald-700">Baca selengkapnya →</p>
        </CardFooter>
      </Card>
    </Link>
  )
}
