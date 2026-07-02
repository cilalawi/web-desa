import Image from 'next/image'
import { notFound } from 'next/navigation'
import { PageHero } from '@/components/public/PageHero'
import { Card, CardContent } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'

export default async function DetailBeritaPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = await prisma.news.findUnique({ where: { slug } })

  if (!article || article.status !== 'PUBLISHED') notFound()

  const cover = article.coverAssetId ? await prisma.mediaAsset.findUnique({ where: { id: article.coverAssetId } }) : null

  return (
    <article className="mx-auto max-w-5xl px-4 py-14">
      <PageHero
        eyebrow="Berita"
        title={article.title}
        description={article.publishedAt?.toLocaleDateString('id-ID', { dateStyle: 'full' }) ?? 'Berita Desa Cilalawi'}
      />
      {cover ? (
        <div className="mt-8 overflow-hidden rounded-[2rem] border border-emerald-900/10 bg-white p-2 shadow-lg shadow-emerald-900/10">
          <Image src={cover.url} alt={cover.alt} width={1200} height={720} className="aspect-[16/9] w-full rounded-[1.5rem] object-cover" />
        </div>
      ) : null}
      <Card className="mt-8 border-emerald-900/10 bg-white shadow-sm shadow-emerald-900/5">
        <CardContent className="p-7">
          <div className="max-w-none whitespace-pre-line text-base leading-8 text-emerald-950/75">{article.body}</div>
        </CardContent>
      </Card>
    </article>
  )
}
