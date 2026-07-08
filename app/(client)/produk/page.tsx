import type { Metadata } from 'next'
import { EmptyState } from '@/components/public/EmptyState'
import { ImageCarousel } from '@/components/public/ImageCarousel'
import { PageHero } from '@/components/public/PageHero'
import { Card, CardContent } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'
import { getSiteSettings, settingValue } from '@/lib/site-settings'

export const metadata: Metadata = {
  title: 'Etalase Produk UMKM Desa Cilalawi - Portal Resmi',
  description: 'Mendukung ekonomi lokal. Temukan aneka produk lokal, hasil bumi, dan kreativitas UMKM masyarakat Desa Cilalawi.',
}

export default async function ProdukPage() {
  const [products, settings] = await Promise.all([
    prisma.product.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { name: 'asc' },
    }),
    getSiteSettings(['empty.products']),
  ])
  const imageAssetIds = products.flatMap((product) => [...(product.imageAssetIds || []), product.imageAssetId].filter((id): id is string => Boolean(id)))
  const mediaAssets = imageAssetIds.length ? await prisma.mediaAsset.findMany({ where: { id: { in: imageAssetIds } } }) : []
  const mediaAsset = new Map(mediaAssets.map((asset) => [asset.id, asset]))

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <PageHero eyebrow="Produk" title="Produk Desa" description="Etalase produk lokal, UMKM, dan potensi ekonomi masyarakat Desa Cilalawi." />
      <div className="mt-5 grid gap-3 md:mt-8 md:grid-cols-3 md:gap-5">
        {products.length ? (
          products.map((product) => {
            const itemImages = (product.imageAssetIds || []).length
              ? product.imageAssetIds.map((id) => mediaAsset.get(id)).filter((img): img is NonNullable<typeof img> => Boolean(img))
              : product.imageAssetId
              ? [mediaAsset.get(product.imageAssetId)].filter((img): img is NonNullable<typeof img> => Boolean(img))
              : []
            return (
              <Card key={product.id} className="border-emerald-900/10 bg-white shadow-sm shadow-emerald-900/5 transition-all hover:-translate-y-1 hover:shadow-lg">
                <CardContent className="p-4 md:p-5">
                  {itemImages.length > 0 ? (
                    <ImageCarousel images={itemImages} className="mb-3 aspect-video rounded-[1rem] overflow-hidden md:mb-4 md:rounded-[1.25rem]" />
                  ) : null}
                  <p className="text-base font-bold text-emerald-950 md:text-lg">{product.name}</p>
                  <p className="mt-1.5 text-xs leading-5 text-emerald-950/65 md:mt-2 md:text-sm md:leading-6">{product.description}</p>
                  {product.contact ? <p className="mt-3 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-800 md:mt-4 md:py-2 md:text-xs">Kontak: {product.contact}</p> : null}
                </CardContent>
              </Card>
            )
          })
        ) : (
          <EmptyState className="md:col-span-3" message={settingValue(settings, 'empty.products')} />
        )}
      </div>
    </section>
  )
}
