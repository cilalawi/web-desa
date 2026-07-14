import { AdminCrudDialog } from '@/components/admin/AdminCrudDialog'
import { AdminForm } from '@/components/admin/AdminForm'
import { StatusField, TextField } from '@/components/admin/AdminInputs'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { SaveNotice } from '@/components/admin/SaveNotice'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'
import { deleteStatistic, upsertStatistic } from '../../actions'

type Item = { id?: string; label?: string; value?: string; category?: string; note?: string | null; order?: number; status?: string }

function StatForm({ item }: { item?: Item }) {
  return (
    <AdminForm action={upsertStatistic}>
      {item?.id ? <input type="hidden" name="id" value={item.id} /> : null}
      <TextField name="label" label="Label (Contoh: Luas Wilayah, Agama Islam)" defaultValue={item?.label} />
      <TextField name="value" label="Nilai (Contoh: 284,14 Ha, 5.437 Jiwa)" defaultValue={item?.value} />
      <TextField name="category" label="Kategori (Contoh: Umum, Batas Wilayah, Agama, Kelompok Usia, Pendidikan, Kesehatan, Keagamaan)" defaultValue={item?.category ?? 'Umum'} />
      <TextField name="note" label="Catatan (Opsional)" defaultValue={item?.note ?? ''} required={false} />
      <TextField name="order" label="Urutan" type="number" defaultValue={item?.order ?? 0} />
      <StatusField defaultValue={item?.status ?? 'PUBLISHED'} />
    </AdminForm>
  )
}

export default async function AdminStatistikPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>
}) {
  const notice = await searchParams
  const items = await prisma.statistic.findMany({ orderBy: { order: 'asc' } })

  // Group items by category dynamically
  const groupedItems = items.reduce((acc, item) => {
    const category = item.category || 'Umum'
    if (!acc[category]) acc[category] = []
    acc[category].push(item)
    return acc
  }, {} as Record<string, typeof items>)

  const categories = Object.keys(groupedItems).sort((a, b) => {
    // Keep 'Umum' first
    if (a === 'Umum') return -1
    if (b === 'Umum') return 1
    return a.localeCompare(b)
  })

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <AdminPageHeader title="Kelola Statistik & Demografi" description="Kelola detail statistik kependudukan, wilayah, dan sarana prasarana desa secara fleksibel." />
        <AdminCrudDialog title="Tambah Statistik" description="Tambahkan data statistik baru ke halaman publik." trigger="Tambah Statistik">
          <StatForm />
        </AdminCrudDialog>
      </div>
      {notice.saved ? <SaveNotice type="saved" /> : null}
      {notice.deleted ? <SaveNotice type="deleted" /> : null}

      {!items.length ? (
        <Card>
          <CardContent className="text-sm text-muted-foreground pt-6">Belum ada data statistik.</CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {categories.map((category) => {
            const categoryItems = groupedItems[category]
            return (
              <div key={category} className="space-y-3">
                <h2 className="text-xs font-black uppercase tracking-wider text-emerald-800 border-b border-emerald-900/10 pb-2">
                  Kategori: {category}
                </h2>
                <div className="grid gap-3 md:grid-cols-2">
                  {categoryItems.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="grid gap-3 pt-4">
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <p className="text-2xl font-bold text-black">{item.value}</p>
                            <p className="text-sm text-muted-foreground">{item.label}</p>
                            {item.note ? <p className="text-[10px] text-muted-foreground mt-0.5">{item.note}</p> : null}
                          </div>
                          <StatusBadge status={item.status} />
                        </div>
                        <div className="flex gap-2">
                          <AdminCrudDialog title="Edit Statistik" description="Perbarui statistik desa." trigger="Edit">
                            <StatForm item={item} />
                          </AdminCrudDialog>
                          <form action={deleteStatistic}>
                            <input type="hidden" name="id" value={item.id} />
                            <Button variant="outline" className="rounded-full text-destructive">
                              Hapus
                            </Button>
                          </form>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
