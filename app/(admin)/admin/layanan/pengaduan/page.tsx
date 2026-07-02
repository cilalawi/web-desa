import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'
import { updateComplaintStatus } from '../../actions'

export default async function AdminPengaduanPage() {
  const items = await prisma.complaint.findMany({ orderBy: { createdAt: 'desc' } })
  return (
    <section>
      <AdminPageHeader title="Pengaduan Masuk" description="Kelola pengaduan warga dari form layanan." />
      <div className="grid gap-3">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{item.name}</h3>
                  <StatusBadge status={item.status} />
                  <span className="text-xs text-muted-foreground">{item.createdAt.toLocaleString('id-ID')}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{item.message}</p>
                <p className="mt-2 text-xs text-muted-foreground">NIK: {item.nik} · Telp: {item.phone}{item.email ? ` · ${item.email}` : ''}</p>
              </div>
              <form action={updateComplaintStatus} className="flex gap-2">
                <input type="hidden" name="id" value={item.id} />
                <select name="status" defaultValue={item.status} className="h-10 rounded-md border bg-background px-3 text-sm">
                  <option value="NEW">Baru</option>
                  <option value="IN_REVIEW">Ditinjau</option>
                  <option value="RESOLVED">Selesai</option>
                  <option value="REJECTED">Ditolak</option>
                </select>
                <Button className="rounded-full">Update</Button>
              </form>
            </CardContent>
          </Card>
        ))}
        {!items.length ? <Card><CardContent className="text-sm text-muted-foreground">Belum ada pengaduan masuk.</CardContent></Card> : null}
      </div>
    </section>
  )
}
