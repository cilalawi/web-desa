import Image from 'next/image'
import { EmptyState } from '@/components/public/EmptyState'
import { PageHero } from '@/components/public/PageHero'
import { Card, CardContent } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'

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
  const photoAssetIds = officials.map((official) => official.photoAssetId).filter((id): id is string => Boolean(id))
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
            const photo = official.photoAssetId ? mediaAsset.get(official.photoAssetId) : null
            return (
              <Card key={official.id} className="border-emerald-900/10 bg-white shadow-sm shadow-emerald-900/5 transition-all hover:-translate-y-1 hover:shadow-lg">
                <CardContent className="p-5">
                  {photo ? (
                    <Image
                      src={photo.url}
                      alt={photo.alt}
                      width={360}
                      height={360}
                      className="mb-5 aspect-square rounded-[1.5rem] object-cover"
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
