import Image from 'next/image'
import { AdminCrudDialog } from '@/components/admin/AdminCrudDialog'
import { AdminForm } from '@/components/admin/AdminForm'
import { FileField, StatusField, TextAreaField, TextField } from '@/components/admin/AdminInputs'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'
import { deleteGalleryItem, upsertGalleryItem } from '../actions'

type Item = { id?: string; title?: string; description?: string | null; mediaAssetId?: string | null; order?: number; status?: string }

function GalleryForm({ item }: { item?: Item }) {
  return (
    <AdminForm action={upsertGalleryItem}>
      {item?.id ? <input type="hidden" name="id" value={item.id} /> : null}
      <TextField name="title" label="Judul" defaultValue={item?.title} />
      <TextAreaField name="description" label="Deskripsi" defaultValue={item?.description} required={false} />
      <FileField name="image" label="Foto galeri" />
      <TextField name="order" label="Urutan" type="number" defaultValue={item?.order ?? 0} />
      <StatusField defaultValue={item?.status ?? 'DRAFT'} />
    </AdminForm>
  )
}

export default async function AdminGaleriPage() {
  const items = await prisma.galleryItem.findMany({ orderBy: { order: 'asc' } })
  const mediaAssetIds = items.map((item) => item.mediaAssetId).filter((id): id is string => Boolean(id))
  const mediaAssets = mediaAssetIds.length ? await prisma.mediaAsset.findMany({ where: { id: { in: mediaAssetIds } } }) : []
  const mediaAsset = new Map(mediaAssets.map((asset) => [asset.id, asset]))

  return (
    <section>
      <div className="flex items-start justify-between gap-4">
        <AdminPageHeader title="Kelola Galeri" description="Tempat admin mengelola dokumentasi kegiatan desa." />
        <AdminCrudDialog title="Tambah Galeri" description="Data foto akan siap dipasangkan dengan upload gambar." trigger="Tambah Galeri"><GalleryForm /></AdminCrudDialog>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {items.map((item) => {
          const image = item.mediaAssetId ? mediaAsset.get(item.mediaAssetId) : null
          return (
            <Card key={item.id}><CardContent className="grid gap-3">
              <div className="aspect-video overflow-hidden rounded-xl bg-neutral-100">
                {image ? <Image src={image.url} alt={image.alt} width={480} height={270} className="h-full w-full object-cover" /> : null}
              </div>
              <div className="flex items-start justify-between gap-2"><div><p className="font-semibold">{item.title}</p>{item.description ? <p className="mt-1 text-sm text-muted-foreground">{item.description}</p> : null}</div><StatusBadge status={item.status} /></div>
              <div className="flex gap-2"><AdminCrudDialog title="Edit Galeri" description="Perbarui item galeri." trigger="Edit"><GalleryForm item={item} /></AdminCrudDialog><form action={deleteGalleryItem}><input type="hidden" name="id" value={item.id} /><Button variant="outline" className="rounded-full text-destructive">Hapus</Button></form></div>
            </CardContent></Card>
          )
        })}
        {!items.length ? <Card><CardContent className="text-sm text-muted-foreground">Belum ada galeri.</CardContent></Card> : null}
      </div>
    </section>
  )
}
