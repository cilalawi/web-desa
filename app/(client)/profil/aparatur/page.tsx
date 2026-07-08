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
    <div className="mb-3 grid aspect-square place-items-center rounded-[1.1rem] border border-emerald-900/10 bg-gradient-to-br from-emerald-100 to-lime-100 text-3xl font-black text-emerald-800 shadow-inner md:mb-5 md:rounded-[1.5rem] md:text-4xl">
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
    <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <PageHero eyebrow="Profil" title="Aparatur Desa" description="Daftar perangkat desa dan peran pelayanan warga Desa Cilalawi." />
      <div className="mt-5 grid gap-3 sm:grid-cols-2 md:mt-8 md:gap-5 lg:grid-cols-4">
        {officials.length ? (
          officials.map((official) => {
            const itemImages = (official.photoAssetIds || []).length
              ? official.photoAssetIds.map((id) => mediaAsset.get(id)).filter((img): img is NonNullable<typeof img> => Boolean(img))
              : official.photoAssetId
              ? [mediaAsset.get(official.photoAssetId)].filter((img): img is NonNullable<typeof img> => Boolean(img))
              : []
            return (
              <Card key={official.id} className="border-emerald-900/10 bg-white shadow-sm shadow-emerald-900/5 transition-all hover:-translate-y-1 hover:shadow-lg">
                <CardContent className="p-4 md:p-5">
                  {itemImages.length > 0 ? (
                    <ImageCarousel
                      images={itemImages}
                      className="mb-3 aspect-square rounded-[1.1rem] overflow-hidden md:mb-5 md:rounded-[1.5rem]"
                    />
                  ) : (
                    <MockOfficialPhoto name={official.name} />
                  )}
                  <p className="text-base font-bold text-emerald-950 md:text-lg">{official.name}</p>
                  <p className="mt-1 text-xs font-medium text-emerald-700 md:text-sm">{official.position}</p>
                  {official.bio ? <p className="mt-2 text-xs leading-5 text-emerald-950/65 md:mt-3 md:text-sm md:leading-6">{official.bio}</p> : null}
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
