import { AdminCrudDialog } from '@/components/admin/AdminCrudDialog'
import { AdminForm } from '@/components/admin/AdminForm'
import { StatusField, TextAreaField, TextField } from '@/components/admin/AdminInputs'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { SaveNotice } from '@/components/admin/SaveNotice'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'
import { deleteAgenda, upsertAgenda } from '../../actions'

type Item = { id?: string; title?: string; description?: string; location?: string | null; startsAt?: Date | null; status?: string }

function dateValue(value?: Date | null) {
  return value ? value.toISOString().slice(0, 16) : ''
}

function AgendaForm({ item }: { item?: Item }) {
  return (
    <AdminForm action={upsertAgenda}>
      {item?.id ? <input type="hidden" name="id" value={item.id} /> : null}
      <TextField name="title" label="Judul" defaultValue={item?.title} />
      <TextAreaField name="description" label="Deskripsi" defaultValue={item?.description} />
      <TextField name="location" label="Lokasi" defaultValue={item?.location} required={false} />
      <TextField name="startsAt" label="Waktu Mulai" type="datetime-local" defaultValue={dateValue(item?.startsAt)} required={false} />
      <StatusField defaultValue={item?.status ?? 'DRAFT'} />
    </AdminForm>
  )
}

export default async function AdminAgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>
}) {
  const notice = await searchParams
  const items = await prisma.agenda.findMany({ orderBy: { startsAt: 'desc' } })

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <AdminPageHeader title="Kelola Agenda" description="Kelola jadwal kegiatan, musyawarah, dan acara desa." />
        <AdminCrudDialog title="Tambah Agenda" description="Agenda terbit akan tampil di halaman informasi." trigger="Tambah Agenda"><AgendaForm /></AdminCrudDialog>
      </div>
      {notice.saved ? <SaveNotice type="saved" /> : null}
      {notice.deleted ? <SaveNotice type="deleted" /> : null}
      <div className="grid gap-3">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
              <div>
                <div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold">{item.title}</h3><StatusBadge status={item.status} /></div>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.startsAt?.toLocaleString('id-ID') ?? 'Waktu belum diisi'}{item.location ? ` · ${item.location}` : ''}</p>
              </div>
              <div className="flex gap-2">
                <AdminCrudDialog title="Edit Agenda" description="Perbarui agenda desa." trigger="Edit"><AgendaForm item={item} /></AdminCrudDialog>
                <form action={deleteAgenda}><input type="hidden" name="id" value={item.id} /><Button variant="outline" className="rounded-full text-destructive">Hapus</Button></form>
              </div>
            </CardContent>
          </Card>
        ))}
        {!items.length ? <Card><CardContent className="text-sm text-muted-foreground">Belum ada agenda.</CardContent></Card> : null}
      </div>
    </section>
  )
}
