import { AdminCrudDialog } from '@/components/admin/AdminCrudDialog'
import { AdminForm } from '@/components/admin/AdminForm'
import { StatusField, TextAreaField, TextField } from '@/components/admin/AdminInputs'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { SaveNotice } from '@/components/admin/SaveNotice'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'
import { deleteService, upsertService } from '../actions'

type Item = { id?: string; title?: string; description?: string; requirements?: string | null; order?: number; status?: string }

function ServiceForm({ item }: { item?: Item }) {
  return (
    <AdminForm action={upsertService}>
      {item?.id ? <input type="hidden" name="id" value={item.id} /> : null}
      <TextField name="title" label="Nama layanan" defaultValue={item?.title} />
      <TextAreaField name="description" label="Deskripsi" defaultValue={item?.description} />
      <TextAreaField name="requirements" label="Syarat" defaultValue={item?.requirements} required={false} />
      <TextField name="order" label="Urutan" type="number" defaultValue={item?.order ?? 0} />
      <StatusField defaultValue={item?.status ?? 'PUBLISHED'} />
    </AdminForm>
  )
}

export default async function AdminLayananPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>
}) {
  const notice = (await searchParams) || {}
  const items = await prisma.service.findMany({ orderBy: { order: 'asc' } })

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><AdminPageHeader title="Kelola Layanan Warga" description="Tempat admin mengatur layanan, syarat, dan alur pengajuan warga." /><AdminCrudDialog title="Tambah Layanan" description="Layanan terbit tampil di halaman layanan warga." trigger="Tambah Layanan"><ServiceForm /></AdminCrudDialog></div>
      {notice.saved ? <SaveNotice type="saved" /> : null}
      {notice.deleted ? <SaveNotice type="deleted" /> : null}
      <div className="grid gap-3">
        {items.map((item) => <Card key={item.id}><CardContent className="grid gap-4 md:grid-cols-[1fr_auto]"><div><div className="flex items-center gap-2"><h3 className="font-semibold">{item.title}</h3><StatusBadge status={item.status} /></div><p className="mt-2 text-sm text-muted-foreground">{item.description}</p></div><div className="flex gap-2"><AdminCrudDialog title="Edit Layanan" description="Perbarui layanan warga." trigger="Edit"><ServiceForm item={item} /></AdminCrudDialog><form action={deleteService}><input type="hidden" name="id" value={item.id} /><Button variant="outline" className="rounded-full text-destructive">Hapus</Button></form></div></CardContent></Card>)}
        {!items.length ? <Card><CardContent className="text-sm text-muted-foreground">Belum ada layanan.</CardContent></Card> : null}
      </div>
    </section>
  )
}
