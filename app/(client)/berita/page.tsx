import type { Metadata } from 'next'
import { EmptyState } from '@/components/public/EmptyState'
import { NewsCard } from '@/components/public/NewsCard'
import { PageHero } from '@/components/public/PageHero'
import { prisma } from '@/lib/prisma'
import { getSiteSettings, settingValue } from '@/lib/site-settings'

export const metadata: Metadata = {
  title: 'Kabar & Berita Desa Cilalawi - Portal Resmi',
  description: 'Ikuti perkembangan berita terbaru, pengumuman resmi, agenda kegiatan, dan pembangunan di Desa Cilalawi.',
}

export default async function BeritaPage() {
  const [news, settings] = await Promise.all([
    prisma.news.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
    }),
    getSiteSettings(['empty.news']),
  ])
  const coverAssetIds = news.flatMap((item) => [...(item.coverAssetIds || []), item.coverAssetId].filter((id): id is string => Boolean(id)))
  const mediaAssets = coverAssetIds.length ? await prisma.mediaAsset.findMany({ where: { id: { in: coverAssetIds } } }) : []
  const mediaAsset = new Map(mediaAssets.map((asset) => [asset.id, asset]))

  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <PageHero eyebrow="Berita" title="Berita Desa" description="Kabar terbaru, dokumentasi kegiatan, dan informasi pembangunan Desa Cilalawi." />
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {news.length ? (
          news.map((item) => {
            const itemImages = (item.coverAssetIds || []).length
              ? item.coverAssetIds.map((id) => mediaAsset.get(id)).filter((img): img is NonNullable<typeof img> => Boolean(img))
              : item.coverAssetId
              ? [mediaAsset.get(item.coverAssetId)].filter((img): img is NonNullable<typeof img> => Boolean(img))
              : []
            return (
              <NewsCard
                key={item.id}
                title={item.title}
                slug={item.slug}
                excerpt={item.excerpt}
                image={item.coverAssetId ? mediaAsset.get(item.coverAssetId) : null}
                images={itemImages}
              />
            )
          })
        ) : (
          <EmptyState className="md:col-span-3" message={settingValue(settings, 'empty.news')} />
        )}
      </div>
    </section>
  )
}
