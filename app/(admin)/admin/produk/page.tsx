import Image from 'next/image'
import { AdminCrudDialog } from '@/components/admin/AdminCrudDialog'
import { AdminForm } from '@/components/admin/AdminForm'
import { FileField, StatusField, TextAreaField, TextField } from '@/components/admin/AdminInputs'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { SaveNotice } from '@/components/admin/SaveNotice'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'
import { deleteProduct, upsertProduct } from '../actions'

type Item = {
  id?: string
  name?: string
  description?: string
  contact?: string | null
  imageAssetId?: string | null
  imageAssetIds?: string[]
  status?: string
}

function ProductForm({
  item,
  currentImages = [],
}: {
  item?: Item
  currentImages?: { id: string; url: string; alt: string }[]
}) {
  return (
    <AdminForm action={upsertProduct}>
      {item?.id ? <input type="hidden" name="id" value={item.id} /> : null}
      <TextField name="name" label="Nama produk" defaultValue={item?.name} />
      <TextAreaField name="description" label="Deskripsi" defaultValue={item?.description} />
      <TextField name="contact" label="Kontak" defaultValue={item?.contact} required={false} />
      <FileField name="image" label="Foto produk" currentImages={currentImages} />
      <StatusField defaultValue={item?.status ?? 'DRAFT'} />
    </AdminForm>
  )
}

export default async function AdminProdukPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>
}) {
  const notice = (await searchParams) || {}
  const items = await prisma.product.findMany({ orderBy: { updatedAt: 'desc' } })
  const imageAssetIds = items.flatMap((item) => [...(item.imageAssetIds || []), item.imageAssetId].filter((id): id is string => Boolean(id)))
  const mediaAssets = imageAssetIds.length ? await prisma.mediaAsset.findMany({ where: { id: { in: imageAssetIds } } }) : []
  const mediaAsset = new Map(mediaAssets.map((asset) => [asset.id, asset]))

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <AdminPageHeader title="Kelola Produk Desa" description="Kelola produk UMKM, hasil pertanian, dan kerajinan lokal." />
        <AdminCrudDialog title="Tambah Produk" description="Produk terbit tampil di etalase publik." trigger="Tambah Produk"><ProductForm /></AdminCrudDialog>
      </div>
      {notice.saved ? <SaveNotice type="saved" /> : null}
      {notice.deleted ? <SaveNotice type="deleted" /> : null}
      <div className="grid gap-3 md:grid-cols-3">
        {items.map((item) => {
          const itemImages = (item.imageAssetIds || []).length
            ? item.imageAssetIds.map((id) => mediaAsset.get(id)).filter((img): img is NonNullable<typeof img> => Boolean(img))
            : item.imageAssetId
            ? [mediaAsset.get(item.imageAssetId)].filter((img): img is NonNullable<typeof img> => Boolean(img))
            : []
          const image = itemImages[0]
          return (
            <Card key={item.id}><CardContent className="grid gap-3">
              <div className="aspect-video overflow-hidden rounded-xl bg-neutral-100">
                {image ? <Image src={image.url} alt={image.alt} width={480} height={270} className="h-full w-full object-cover" /> : null}
              </div>
              <div className="flex items-start justify-between gap-2"><div><p className="font-semibold">{item.name}</p><p className="mt-1 text-sm text-muted-foreground">{item.description}</p>{item.contact ? <p className="mt-2 text-xs font-medium text-black">{item.contact}</p> : null}</div><StatusBadge status={item.status} /></div>
              <div className="flex gap-2"><AdminCrudDialog title="Edit Produk" description="Perbarui produk desa." trigger="Edit"><ProductForm item={item} currentImages={itemImages} /></AdminCrudDialog><form action={deleteProduct}><input type="hidden" name="id" value={item.id} /><Button variant="outline" className="rounded-full text-destructive">Hapus</Button></form></div>
            </CardContent></Card>
          )
        })}
        {!items.length ? <Card><CardContent className="text-sm text-muted-foreground">Belum ada produk.</CardContent></Card> : null}
      </div>
    </section>
  )
}
