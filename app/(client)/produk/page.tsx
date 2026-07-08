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
    <section className="mx-auto max-w-6xl px-4 py-14">
      <PageHero eyebrow="Produk" title="Produk Desa" description="Etalase produk lokal, UMKM, dan potensi ekonomi masyarakat Desa Cilalawi." />
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {products.length ? (
          products.map((product) => {
            const itemImages = (product.imageAssetIds || []).length
              ? product.imageAssetIds.map((id) => mediaAsset.get(id)).filter((img): img is NonNullable<typeof img> => Boolean(img))
              : product.imageAssetId
              ? [mediaAsset.get(product.imageAssetId)].filter((img): img is NonNullable<typeof img> => Boolean(img))
              : []
            return (
              <Card key={product.id} className="border-emerald-900/10 bg-white shadow-sm shadow-emerald-900/5 transition-all hover:-translate-y-1 hover:shadow-lg">
                <CardContent className="p-5">
                  {itemImages.length > 0 ? (
                    <ImageCarousel images={itemImages} className="mb-4 aspect-video rounded-[1.25rem] overflow-hidden" />
                  ) : null}
                  <p className="text-lg font-bold text-emerald-950">{product.name}</p>
                  <p className="mt-2 text-sm leading-6 text-emerald-950/65">{product.description}</p>
                  {product.contact ? <p className="mt-4 rounded-full bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800">Kontak: {product.contact}</p> : null}
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
