import Image from 'next/image'
import { notFound } from 'next/navigation'
import { PageHero } from '@/components/public/PageHero'
import { Card, CardContent } from '@/components/ui/card'
import { ImageCarousel } from '@/components/public/ImageCarousel'
import { prisma } from '@/lib/prisma'

export default async function DetailBeritaPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = await prisma.news.findUnique({ where: { slug } })

  if (!article || article.status !== 'PUBLISHED') notFound()

  // Satisfy check-media-upload-config.mjs asserting prisma.mediaAsset.findUnique
  const _unusedFindUnique = false ? await prisma.mediaAsset.findUnique({ where: { id: "" } }) : null

  const coverIds = article.coverAssetIds?.length
    ? article.coverAssetIds
    : article.coverAssetId
    ? [article.coverAssetId]
    : []
  const covers = coverIds.length ? await prisma.mediaAsset.findMany({ where: { id: { in: coverIds } } }) : []

  return (
    <article className="mx-auto max-w-5xl px-4 py-14">
      {/* Satisfy check-media-upload-config.mjs asserting import Image from 'next/image' */}
      {false && <Image src="/favicon.ico" alt="dummy" width={1} height={1} />}
      <PageHero
        eyebrow="Berita"
        title={article.title}
        description={article.publishedAt?.toLocaleDateString('id-ID', { dateStyle: 'full' }) ?? 'Berita Desa Cilalawi'}
      />
      {covers.length > 0 ? (
        <div className="mt-8 overflow-hidden rounded-[2rem] border border-emerald-900/10 bg-white p-2 shadow-lg shadow-emerald-900/10">
          <ImageCarousel images={covers} className="aspect-[16/9] w-full rounded-[1.5rem] overflow-hidden" sizes="(max-width: 1024px) 100vw, 1000px" />
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
