import { AdminCrudDialog } from '@/components/admin/AdminCrudDialog'
import { AdminForm } from '@/components/admin/AdminForm'
import { StatusField, TextAreaField, TextField } from '@/components/admin/AdminInputs'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { SaveNotice } from '@/components/admin/SaveNotice'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'
import { deleteBudgetItem, upsertBudgetItem } from '../actions'

type Item = { id?: string; label?: string; value?: string; description?: string; year?: number; order?: number; status?: string }

function BudgetForm({ item }: { item?: Item }) {
  return (
    <AdminForm action={upsertBudgetItem}>
      {item?.id ? <input type="hidden" name="id" value={item.id} /> : null}
      <TextField name="label" label="Label" defaultValue={item?.label} />
      <TextField name="value" label="Nilai" defaultValue={item?.value} />
      <TextAreaField name="description" label="Keterangan" defaultValue={item?.description} />
      <TextField name="year" label="Tahun" type="number" defaultValue={item?.year ?? new Date().getFullYear()} />
      <TextField name="order" label="Urutan" type="number" defaultValue={item?.order ?? 0} />
      <StatusField defaultValue={item?.status ?? 'DRAFT'} />
    </AdminForm>
  )
}

export default async function AdminAnggaranPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>
}) {
  const notice = (await searchParams) || {}
  const items = await prisma.budgetItem.findMany({ orderBy: [{ year: 'desc' }, { order: 'asc' }] })

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <AdminPageHeader title="Kelola APBDes" description="Kelola data transparansi anggaran desa." />
        <AdminCrudDialog title="Tambah APBDes" description="Data terbit tampil di ringkasan transparansi." trigger="Tambah APBDes"><BudgetForm /></AdminCrudDialog>
      </div>
      {notice.saved ? <SaveNotice type="saved" /> : null}
      {notice.deleted ? <SaveNotice type="deleted" /> : null}
      <div className="grid gap-3">
        {items.map((item) => (
          <Card key={item.id}><CardContent className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
            <div><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold">{item.label}</h3><StatusBadge status={item.status} /><span className="text-xs text-muted-foreground">{item.year}</span></div><p className="mt-2 text-sm font-medium text-black">{item.value}</p><p className="mt-1 text-sm text-muted-foreground">{item.description}</p></div>
            <div className="flex gap-2"><AdminCrudDialog title="Edit APBDes" description="Perbarui data anggaran." trigger="Edit"><BudgetForm item={item} /></AdminCrudDialog><form action={deleteBudgetItem}><input type="hidden" name="id" value={item.id} /><Button variant="outline" className="rounded-full text-destructive">Hapus</Button></form></div>
          </CardContent></Card>
        ))}
        {!items.length ? <Card><CardContent className="text-sm text-muted-foreground">Belum ada data APBDes.</CardContent></Card> : null}
      </div>
    </section>
  )
}
