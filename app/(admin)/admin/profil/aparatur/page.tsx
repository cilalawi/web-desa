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
import { deleteOfficial, upsertOfficial } from '../../actions'

type Item = {
  id?: string
  name?: string
  position?: string
  bio?: string | null
  photoAssetId?: string | null
  photoAssetIds?: string[]
  order?: number
  status?: string
}

function OfficialForm({
  item,
  currentImages = [],
}: {
  item?: Item
  currentImages?: { id: string; url: string; alt: string }[]
}) {
  return (
    <AdminForm action={upsertOfficial}>
      {item?.id ? <input type="hidden" name="id" value={item.id} /> : null}
      <TextField name="name" label="Nama" defaultValue={item?.name} />
      <TextField name="position" label="Jabatan" defaultValue={item?.position} />
      <TextAreaField name="bio" label="Bio singkat" defaultValue={item?.bio} required={false} />
      <FileField name="photo" label="Foto aparatur" currentImages={currentImages} />
      <TextField name="order" label="Urutan" type="number" defaultValue={item?.order ?? 0} />
      <StatusField defaultValue={item?.status ?? 'PUBLISHED'} />
    </AdminForm>
  )
}

export default async function AdminAparaturPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>
}) {
  const notice = await searchParams
  const items = await prisma.villageOfficial.findMany({ orderBy: { order: 'asc' } })
  const photoAssetIds = items.flatMap((item) => [...(item.photoAssetIds || []), item.photoAssetId].filter((id): id is string => Boolean(id)))
  const mediaAssets = photoAssetIds.length ? await prisma.mediaAsset.findMany({ where: { id: { in: photoAssetIds } } }) : []
  const mediaAsset = new Map(mediaAssets.map((asset) => [asset.id, asset]))

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <AdminPageHeader title="Kelola Aparatur Desa" description="Kelola daftar perangkat desa, jabatan, dan foto profil." />
        <AdminCrudDialog title="Tambah Aparatur" description="Data aparatur terbit tampil di profil desa." trigger="Tambah Aparatur"><OfficialForm /></AdminCrudDialog>
      </div>
      {notice.saved ? <SaveNotice type="saved" /> : null}
      {notice.deleted ? <SaveNotice type="deleted" /> : null}
      <div className="grid gap-3 md:grid-cols-2">
        {items.map((item) => {
          const itemImages = (item.photoAssetIds || []).length
            ? item.photoAssetIds.map((id) => mediaAsset.get(id)).filter((img): img is NonNullable<typeof img> => Boolean(img))
            : item.photoAssetId
            ? [mediaAsset.get(item.photoAssetId)].filter((img): img is NonNullable<typeof img> => Boolean(img))
            : []
          const photo = itemImages[0]
          return (
            <Card key={item.id}><CardContent className="grid gap-3">
              <div className="flex items-start gap-4">
                <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-2xl bg-neutral-100">
                  {photo ? <Image src={photo.url} alt={photo.alt} width={160} height={160} className="h-full w-full object-cover" /> : <span className="text-sm font-semibold text-muted-foreground">Foto</span>}
                </div>
                <div className="flex flex-1 items-start justify-between gap-2"><div><p className="font-semibold">{item.name}</p><p className="text-sm text-muted-foreground">{item.position}</p></div><StatusBadge status={item.status} /></div>
              </div>
              <div className="flex gap-2"><AdminCrudDialog title="Edit Aparatur" description="Perbarui aparatur desa." trigger="Edit"><OfficialForm item={item} currentImages={itemImages} /></AdminCrudDialog><form action={deleteOfficial}><input type="hidden" name="id" value={item.id} /><Button variant="outline" className="rounded-full text-destructive">Hapus</Button></form></div>
            </CardContent></Card>
          )
        })}
        {!items.length ? <Card><CardContent className="text-sm text-muted-foreground">Belum ada aparatur.</CardContent></Card> : null}
      </div>
    </section>
  )
}
