import { AdminCrudDialog } from '@/components/admin/AdminCrudDialog'
import { AdminForm } from '@/components/admin/AdminForm'
import { StatusField, TextAreaField, TextField } from '@/components/admin/AdminInputs'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { SaveNotice } from '@/components/admin/SaveNotice'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'
import { deleteAnnouncement, upsertAnnouncement } from '../../actions'

type Item = { id?: string; title?: string; summary?: string; body?: string; status?: string }

function AnnouncementForm({ item }: { item?: Item }) {
  return (
    <AdminForm action={upsertAnnouncement}>
      {item?.id ? <input type="hidden" name="id" value={item.id} /> : null}
      <TextField name="title" label="Judul" defaultValue={item?.title} />
      <TextAreaField name="summary" label="Ringkasan" defaultValue={item?.summary} />
      <TextAreaField name="body" label="Isi pengumuman" defaultValue={item?.body} />
      <StatusField defaultValue={item?.status ?? 'DRAFT'} />
    </AdminForm>
  )
}

export default async function AdminPengumumanPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>
}) {
  const notice = await searchParams
  const items = await prisma.announcement.findMany({ orderBy: { updatedAt: 'desc' } })

  return (
    <section>
      <div className="flex  flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <AdminPageHeader title="Kelola Pengumuman" description="Buat dan terbitkan pengumuman resmi desa." />
        <AdminCrudDialog title="Tambah Pengumuman" description="Pengumuman akan tampil di halaman informasi publik." trigger="Tambah Pengumuman">
          <AnnouncementForm />
        </AdminCrudDialog>
      </div>
      {notice.saved ? <SaveNotice type="saved" /> : null}
      {notice.deleted ? <SaveNotice type="deleted" /> : null}
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-3 md:gap-5">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{item.title}</h3>
                  <StatusBadge status={item.status} />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{item.summary}</p>
              </div>
              <div className="flex gap-2">
                <AdminCrudDialog title="Edit Pengumuman" description="Perbarui pengumuman desa." trigger="Edit">
                  <AnnouncementForm item={item} />
                </AdminCrudDialog>
                <form action={deleteAnnouncement}>
                  <input type="hidden" name="id" value={item.id} />
                  <Button variant="outline" className="rounded-full text-destructive">Hapus</Button>
                </form>
              </div>
            </CardContent>
          </Card>
        ))}
        {!items.length ? <Card><CardContent className="text-sm text-muted-foreground">Belum ada pengumuman.</CardContent></Card> : null}
      </div>
    </section>
  )
}
