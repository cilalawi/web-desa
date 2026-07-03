import { AdminCrudDialog } from '@/components/admin/AdminCrudDialog'
import { AdminForm } from '@/components/admin/AdminForm'
import { StatusField, TextField } from '@/components/admin/AdminInputs'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'
import { deleteStatistic, upsertStatistic } from '../../actions'

type Item = { id?: string; label?: string; value?: string; note?: string | null; order?: number; status?: string }

function StatForm({ item }: { item?: Item }) {
  return (
    <AdminForm action={upsertStatistic}>
      {item?.id ? <input type="hidden" name="id" value={item.id} /> : null}
      <TextField name="label" label="Label" defaultValue={item?.label} />
      <TextField name="value" label="Nilai" defaultValue={item?.value} />
      <TextField name="note" label="Catatan" defaultValue={item?.note} required={false} />
      <TextField name="order" label="Urutan" type="number" defaultValue={item?.order ?? 0} />
      <StatusField defaultValue={item?.status ?? 'PUBLISHED'} />
    </AdminForm>
  )
}

export default async function AdminStatistikPage() {
  const items = await prisma.statistic.findMany({ orderBy: { order: 'asc' } })
  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <AdminPageHeader title="Kelola Statistik" description="Kelola angka penduduk, keluarga, RT/RW, dan potensi desa." />
        <AdminCrudDialog title="Tambah Statistik" description="Statistik terbit tampil di halaman publik." trigger="Tambah Statistik"><StatForm /></AdminCrudDialog>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {items.map((item) => (
          <Card key={item.id}><CardContent className="grid gap-3">
            <div className="flex items-center justify-between gap-2"><div><p className="text-2xl font-bold text-black">{item.value}</p><p className="text-sm text-muted-foreground">{item.label}</p></div><StatusBadge status={item.status} /></div>
            <div className="flex gap-2"><AdminCrudDialog title="Edit Statistik" description="Perbarui statistik desa." trigger="Edit"><StatForm item={item} /></AdminCrudDialog><form action={deleteStatistic}><input type="hidden" name="id" value={item.id} /><Button variant="outline" className="rounded-full text-destructive">Hapus</Button></form></div>
          </CardContent></Card>
        ))}
        {!items.length ? <Card><CardContent className="text-sm text-muted-foreground">Belum ada statistik.</CardContent></Card> : null}
      </div>
    </section>
  )
}
