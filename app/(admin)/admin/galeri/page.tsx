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
import { deleteGalleryItem, upsertGalleryItem } from '../actions'

type Item = {
  id?: string
  title?: string
  description?: string | null
  mediaAssetId?: string | null
  mediaAssetIds?: string[]
  order?: number
  status?: string
}

function GalleryForm({
  item,
  currentImages = [],
}: {
  item?: Item
  currentImages?: { id: string; url: string; alt: string }[]
}) {
  return (
    <AdminForm action={upsertGalleryItem}>
      {item?.id ? <input type="hidden" name="id" value={item.id} /> : null}
      <TextField name="title" label="Judul" defaultValue={item?.title} />
      <TextAreaField name="description" label="Deskripsi" defaultValue={item?.description} required={false} />
      <FileField name="image" label="Foto galeri" currentImages={currentImages} />
      <TextField name="order" label="Urutan" type="number" defaultValue={item?.order ?? 0} />
      <StatusField defaultValue={item?.status ?? 'DRAFT'} />
    </AdminForm>
  )
}

export default async function AdminGaleriPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>
}) {
  const notice = await searchParams
  const items = await prisma.galleryItem.findMany({ orderBy: { order: 'asc' } })
  const mediaAssetIds = items.flatMap((item) => [...(item.mediaAssetIds || []), item.mediaAssetId].filter((id): id is string => Boolean(id)))
  const mediaAssets = mediaAssetIds.length ? await prisma.mediaAsset.findMany({ where: { id: { in: mediaAssetIds } } }) : []
  const mediaAsset = new Map(mediaAssets.map((asset) => [asset.id, asset]))

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <AdminPageHeader title="Kelola Galeri" description="Tempat admin mengelola dokumentasi kegiatan desa." />
        <AdminCrudDialog title="Tambah Galeri" description="Data foto akan siap dipasangkan dengan upload gambar." trigger="Tambah Galeri"><GalleryForm /></AdminCrudDialog>
      </div>
      {notice.saved ? <SaveNotice type="saved" /> : null}
      {notice.deleted ? <SaveNotice type="deleted" /> : null}
      <div className="grid gap-3 md:grid-cols-3">
        {items.map((item) => {
          const itemImages = (item.mediaAssetIds || []).length
            ? item.mediaAssetIds.map((id) => mediaAsset.get(id)).filter((img): img is NonNullable<typeof img> => Boolean(img))
            : item.mediaAssetId
            ? [mediaAsset.get(item.mediaAssetId)].filter((img): img is NonNullable<typeof img> => Boolean(img))
            : []
          const image = itemImages[0]
          return (
            <Card key={item.id}><CardContent className="grid gap-3">
              <div className="aspect-video overflow-hidden rounded-xl bg-neutral-100">
                {image ? <Image src={image.url} alt={image.alt} width={480} height={270} className="h-full w-full object-cover" /> : null}
              </div>
              <div className="flex items-start justify-between gap-2"><div><p className="font-semibold">{item.title}</p>{item.description ? <p className="mt-1 text-sm text-muted-foreground">{item.description}</p> : null}</div><StatusBadge status={item.status} /></div>
              <div className="flex gap-2"><AdminCrudDialog title="Edit Galeri" description="Perbarui item galeri." trigger="Edit"><GalleryForm item={item} currentImages={itemImages} /></AdminCrudDialog><form action={deleteGalleryItem}><input type="hidden" name="id" value={item.id} /><Button variant="outline" className="rounded-full text-destructive">Hapus</Button></form></div>
            </CardContent></Card>
          )
        })}
        {!items.length ? <Card><CardContent className="text-sm text-muted-foreground">Belum ada galeri.</CardContent></Card> : null}
      </div>
    </section>
  )
}
