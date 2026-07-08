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
    <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <PageHero eyebrow="Galeri" title="Galeri Kegiatan" description="Dokumentasi kegiatan, pelayanan, dan suasana Desa Cilalawi." />
      <div className="mt-5 grid gap-3 md:mt-8 md:grid-cols-3 md:gap-5">
        {items.length ? (
          items.map((item) => {
            const itemImages = (item.mediaAssetIds || []).length
              ? item.mediaAssetIds.map((id) => mediaAsset.get(id)).filter((img): img is NonNullable<typeof img> => Boolean(img))
              : item.mediaAssetId
              ? [mediaAsset.get(item.mediaAssetId)].filter((img): img is NonNullable<typeof img> => Boolean(img))
              : []
            return (
              <Card key={item.id} className="overflow-hidden border-emerald-900/10 bg-white shadow-sm shadow-emerald-900/5 transition-all hover:-translate-y-1 hover:shadow-lg">
                <CardContent className="p-4 md:p-5">
                  {itemImages.length > 0 ? (
                    <ImageCarousel images={itemImages} className="mb-3 aspect-video rounded-[1rem] overflow-hidden md:mb-4 md:rounded-[1.25rem]" />
                  ) : null}
                  <p className="text-base font-bold text-emerald-950 md:text-lg">{item.title}</p>
                  {item.description ? <p className="mt-1.5 text-xs leading-5 text-emerald-950/65 md:mt-2 md:text-sm md:leading-6">{item.description}</p> : null}
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
