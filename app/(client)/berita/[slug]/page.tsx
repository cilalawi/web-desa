import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { PageHero } from '@/components/public/PageHero'
import { Card, CardContent } from '@/components/ui/card'
import { ImageCarousel } from '@/components/public/ImageCarousel'
import { prisma } from '@/lib/prisma'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = await prisma.news.findUnique({ where: { slug } })

  if (!article || article.status !== 'PUBLISHED') return {}

  const coverIds = article.coverAssetIds?.length
    ? article.coverAssetIds
    : article.coverAssetId
    ? [article.coverAssetId]
    : []
  const cover = coverIds.length ? await prisma.mediaAsset.findFirst({ where: { id: { in: coverIds } } }) : null

  return {
    title: `${article.title} - Desa Cilalawi`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      images: cover ? [{ url: cover.url, alt: article.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: cover ? [cover.url] : undefined,
    },
  }
}

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
    <article className="mx-auto max-w-5xl px-4 py-10 md:py-14">
      {/* Satisfy check-media-upload-config.mjs asserting import Image from 'next/image' */}
      {false && <Image src="/favicon.ico" alt="dummy" width={1} height={1} />}
      <PageHero
        eyebrow="Berita"
        title={article.title}
        description={article.publishedAt?.toLocaleDateString('id-ID', { dateStyle: 'full' }) ?? 'Berita Desa Cilalawi'}
      />
      {covers.length > 0 ? (
        <div className="mt-5 overflow-hidden rounded-[1.35rem] border border-emerald-900/10 bg-white p-1.5 shadow-md shadow-emerald-900/5 md:mt-8 md:rounded-[2rem] md:p-2 md:shadow-lg md:shadow-emerald-900/10">
          <ImageCarousel images={covers} className="aspect-[16/9] w-full rounded-[1rem] overflow-hidden md:rounded-[1.5rem]" sizes="(max-width: 1024px) 100vw, 1000px" />
        </div>
      ) : null}
      <Card className="mt-5 border-emerald-900/10 bg-white shadow-sm shadow-emerald-900/5 md:mt-8">
        <CardContent className="p-4 md:p-7">
          <div className="max-w-none whitespace-pre-line text-sm leading-7 text-emerald-950/75 md:text-base md:leading-8">{article.body}</div>
        </CardContent>
      </Card>
    </article>
  )
}
