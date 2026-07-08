import type { Metadata } from 'next'
import { EmptyState } from '@/components/public/EmptyState'
import { ImageCarousel } from '@/components/public/ImageCarousel'
import { PageHero } from '@/components/public/PageHero'
import { Card, CardContent } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Aparatur Desa Cilalawi - Portal Resmi',
  description: 'Daftar perangkat desa dan aparatur Pemerintah Desa Cilalawi yang siap melayani kebutuhan administrasi dan pelayanan publik warga.',
}

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'AP'
}

function MockOfficialPhoto({ name }: { name: string }) {
  return (
    <div className="mb-5 grid aspect-square place-items-center rounded-[1.5rem] border border-emerald-900/10 bg-gradient-to-br from-emerald-100 to-lime-100 text-4xl font-black text-emerald-800 shadow-inner">
      {initials(name)}
    </div>
  )
}

export default async function AparaturPage() {
  const officials = await prisma.villageOfficial.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { order: 'asc' },
  })
  const photoAssetIds = officials.flatMap((official) => [...(official.photoAssetIds || []), official.photoAssetId].filter((id): id is string => Boolean(id)))
  const mediaAssets = photoAssetIds.length
    ? await prisma.mediaAsset.findMany({ where: { id: { in: photoAssetIds } } })
    : []
  const mediaAsset = new Map(mediaAssets.map((asset) => [asset.id, asset]))

  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <PageHero eyebrow="Profil" title="Aparatur Desa" description="Daftar perangkat desa dan peran pelayanan warga Desa Cilalawi." />
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {officials.length ? (
          officials.map((official) => {
            const itemImages = (official.photoAssetIds || []).length
              ? official.photoAssetIds.map((id) => mediaAsset.get(id)).filter((img): img is NonNullable<typeof img> => Boolean(img))
              : official.photoAssetId
              ? [mediaAsset.get(official.photoAssetId)].filter((img): img is NonNullable<typeof img> => Boolean(img))
              : []
            return (
              <Card key={official.id} className="border-emerald-900/10 bg-white shadow-sm shadow-emerald-900/5 transition-all hover:-translate-y-1 hover:shadow-lg">
                <CardContent className="p-5">
                  {itemImages.length > 0 ? (
                    <ImageCarousel
                      images={itemImages}
                      className="mb-5 aspect-square rounded-[1.5rem] overflow-hidden"
                    />
                  ) : (
                    <MockOfficialPhoto name={official.name} />
                  )}
                  <p className="text-lg font-bold text-emerald-950">{official.name}</p>
                  <p className="mt-1 text-sm font-medium text-emerald-700">{official.position}</p>
                  {official.bio ? <p className="mt-3 text-sm leading-6 text-emerald-950/65">{official.bio}</p> : null}
                </CardContent>
              </Card>
            )
          })
        ) : (
          <EmptyState className="sm:col-span-2 lg:col-span-4" message="Data aparatur desa belum ditambahkan. Admin desa dapat mengisi dari panel pengelolaan." />
        )}
      </div>
    </section>
  )
}
