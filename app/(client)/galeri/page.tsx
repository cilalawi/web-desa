import type { Metadata } from 'next'
import { EmptyState } from '@/components/public/EmptyState'
import { ImageCarousel } from '@/components/public/ImageCarousel'
import { PageHero } from '@/components/public/PageHero'
import { Card, CardContent } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'
import { getSiteSettings, settingValue } from '@/lib/site-settings'

export const metadata: Metadata = {
  title: 'Galeri & Dokumentasi Kegiatan Desa Cilalawi - Portal Resmi',
  description: 'Dokumentasi visual, foto-foto kegiatan pembangunan, pelayanan warga, dan suasana kemasyarakatan Desa Cilalawi.',
}

export default async function GaleriPage() {
  const [items, settings] = await Promise.all([
    prisma.galleryItem.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { order: 'asc' },
    }),
    getSiteSettings(['empty.gallery']),
  ])
  const mediaAssetIds = items.flatMap((item) => [...(item.mediaAssetIds || []), item.mediaAssetId].filter((id): id is string => Boolean(id)))
  const mediaAssets = mediaAssetIds.length ? await prisma.mediaAsset.findMany({ where: { id: { in: mediaAssetIds } } }) : []
  const mediaAsset = new Map(mediaAssets.map((asset) => [asset.id, asset]))

  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <PageHero eyebrow="Galeri" title="Galeri Kegiatan" description="Dokumentasi kegiatan, pelayanan, dan suasana Desa Cilalawi." />
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {items.length ? (
          items.map((item) => {
            const itemImages = (item.mediaAssetIds || []).length
              ? item.mediaAssetIds.map((id) => mediaAsset.get(id)).filter((img): img is NonNullable<typeof img> => Boolean(img))
              : item.mediaAssetId
              ? [mediaAsset.get(item.mediaAssetId)].filter((img): img is NonNullable<typeof img> => Boolean(img))
              : []
            return (
              <Card key={item.id} className="overflow-hidden border-emerald-900/10 bg-white shadow-sm shadow-emerald-900/5 transition-all hover:-translate-y-1 hover:shadow-lg">
                <CardContent className="p-5">
                  {itemImages.length > 0 ? (
                    <ImageCarousel images={itemImages} className="mb-4 aspect-video rounded-[1.25rem] overflow-hidden" />
                  ) : null}
                  <p className="text-lg font-bold text-emerald-950">{item.title}</p>
                  {item.description ? <p className="mt-2 text-sm leading-6 text-emerald-950/65">{item.description}</p> : null}
                </CardContent>
              </Card>
            )
          })
        ) : (
          <EmptyState className="md:col-span-3" message={settingValue(settings, 'empty.gallery')} />
        )}
      </div>
    </section>
  )
}
