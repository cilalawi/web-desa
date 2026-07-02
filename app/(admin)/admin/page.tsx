import Link from 'next/link'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'

export default async function AdminDashboardPage() {
  const [news, announcements, complaints, officials, services, products, gallery, budget] = await Promise.all([
    prisma.news.count(),
    prisma.announcement.count(),
    prisma.complaint.count({ where: { status: 'NEW' } }),
    prisma.villageOfficial.count(),
    prisma.service.count(),
    prisma.product.count(),
    prisma.galleryItem.count(),
    prisma.budgetItem.count(),
  ])

  const modules = [
    { label: 'Berita', count: news, href: '/admin/berita' },
    { label: 'Pengumuman', count: announcements, href: '/admin/informasi/pengumuman' },
    { label: 'Pengaduan Baru', count: complaints, href: '/admin/layanan/pengaduan' },
    { label: 'Aparatur', count: officials, href: '/admin/profil/aparatur' },
    { label: 'Layanan', count: services, href: '/admin/layanan' },
    { label: 'Produk', count: products, href: '/admin/produk' },
    { label: 'Galeri', count: gallery, href: '/admin/galeri' },
    { label: 'APBDes', count: budget, href: '/admin/anggaran' },
  ]

  return (
    <section>
      <AdminPageHeader title="Dashboard" description="Ringkasan pengelolaan website desa." />
      <div className="grid gap-4 md:grid-cols-4">
        {modules.map((m) => (
          <Link key={m.label} href={m.href}>
            <Card className="transition-colors hover:border-neutral-400">
              <CardContent>
                <p className="text-3xl font-bold text-black">{m.count}</p>
                <p className="mt-1 text-sm text-muted-foreground">{m.label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
