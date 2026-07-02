import Image from 'next/image'
import { EmptyState } from '@/components/public/EmptyState'
import { PageHero } from '@/components/public/PageHero'
import { Card, CardContent } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'
import { getSiteSettings, settingValue } from '@/lib/site-settings'

export default async function GaleriPage() {
  const [items, settings] = await Promise.all([
    prisma.galleryItem.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { order: 'asc' },
    }),
    getSiteSettings(['empty.gallery']),
  ])
  const mediaAssetIds = items.map((item) => item.mediaAssetId).filter((id): id is string => Boolean(id))
  const mediaAssets = mediaAssetIds.length ? await prisma.mediaAsset.findMany({ where: { id: { in: mediaAssetIds } } }) : []
  const mediaAsset = new Map(mediaAssets.map((asset) => [asset.id, asset]))

  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <PageHero eyebrow="Galeri" title="Galeri Kegiatan" description="Dokumentasi kegiatan, pelayanan, dan suasana Desa Cilalawi." />
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {items.length ? (
          items.map((item) => {
            const photo = item.mediaAssetId ? mediaAsset.get(item.mediaAssetId) : null
            return (
              <Card key={item.id} className="overflow-hidden border-emerald-900/10 bg-white shadow-sm shadow-emerald-900/5 transition-all hover:-translate-y-1 hover:shadow-lg">
                <CardContent className="p-5">
                  {photo ? (
                    <Image src={photo.url} alt={photo.alt} width={640} height={420} className="mb-4 aspect-video rounded-[1.25rem] object-cover" />
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
