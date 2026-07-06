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
import { deleteNews, upsertNews } from '../actions'

type NewsFormItem = { id?: string; title?: string; excerpt?: string; body?: string; coverAssetId?: string | null; status?: string }

function NewsForm({ item }: { item?: NewsFormItem }) {
  return (
    <AdminForm action={upsertNews}>
      {item?.id ? <input type="hidden" name="id" value={item.id} /> : null}
      <TextField name="title" label="Judul" defaultValue={item?.title} />
      <TextAreaField name="excerpt" label="Ringkasan" defaultValue={item?.excerpt} />
      <TextAreaField name="body" label="Isi berita" defaultValue={item?.body} />
      <FileField name="coverImage" label="Gambar sampul berita" />
      <StatusField defaultValue={item?.status ?? 'DRAFT'} />
    </AdminForm>
  )
}

export default async function AdminBeritaPage({
  searchParams,
}: {
  i
  searchParams: Promise<{ saved?: string; deleted?: string }>
}) {
  const notice = await searchParams
  const items = await prisma.news.findMany({ orderBy: { updatedAt: 'desc' } })
  const coverAssetIds = items.map((item) => item.coverAssetId).filter((id): id is string => Boolean(id))
  const mediaAssets = coverAssetIds.length ? await prisma.mediaAsset.findMany({ where: { id: { in: coverAssetIds } } }) : []
  const mediaAsset = new Map(mediaAssets.map((asset) => [asset.id, asset]))

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <AdminPageHeader title="Kelola Berita" description="Buat, ubah, dan terbitkan berita desa." />
        <AdminCrudDialog title="Tambah Berita" description="Isi berita yang akan tampil di halaman publik." trigger="Tambah Berita">
          <NewsForm />
        </AdminCrudDialog>
      </div>
      {notice.saved ? <SaveNotice type="saved" /> : null}
      {notice.deleted ? <SaveNotice type="deleted" /> : null}
      <div className="grid gap-3">
        {items.map((item) => {
          const cover = item.coverAssetId ? mediaAsset.get(item.coverAssetId) : null
          return (
            <Card key={item.id}>
              <CardContent className="grid gap-4 md:grid-cols-[12rem_1fr_auto] md:items-start">
                <div className="aspect-video overflow-hidden rounded-xl bg-neutral-100">
                  {cover ? <Image src={cover.url} alt={cover.alt} width={320} height={180} className="h-full w-full object-cover" /> : null}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{item.title}</h3>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{item.excerpt}</p>
                </div>
                <div className="flex gap-2">
                  <AdminCrudDialog title="Edit Berita" description="Perbarui berita desa." trigger="Edit">
                    <NewsForm item={item} />
                  </AdminCrudDialog>
                  <form action={deleteNews}>
                    <input type="hidden" name="id" value={item.id} />
                    <Button variant="outline" className="rounded-full text-destructive">Hapus</Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          )
        })}
        {!items.length ? <Card><CardContent className="text-sm text-muted-foreground">Belum ada berita.</CardContent></Card> : null}
      </div>
    </section>
  )
}
