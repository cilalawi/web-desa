import Link from 'next/link'
import { EmptyState } from '@/components/public/EmptyState'
import { PageHero } from '@/components/public/PageHero'
import { Card, CardContent } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'
import { getSiteSettings, settingValue } from '@/lib/site-settings'

export default async function LayananPage() {
  const [services, settings] = await Promise.all([
    prisma.service.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { order: 'asc' },
    }),
    getSiteSettings(['empty.services']),
  ])

  const serviceHref: Record<string, string> = {
    'pengaduan-warga': '/layanan/pengaduan',
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <PageHero eyebrow="Layanan" title="Layanan Warga" description="Akses kanal layanan desa yang tersedia untuk warga secara jelas dan tertib." />
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {services.length ? (
          services.map((service) => (
            <Link key={service.id} href={serviceHref[service.slug] ?? `/layanan/${service.slug}`} className="block h-full">
              <Card className="h-full border-emerald-900/10 bg-white shadow-sm shadow-emerald-900/5 transition-all hover:-translate-y-1 hover:border-emerald-700/25 hover:shadow-lg">
                <CardContent className="p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Layanan Desa</p>
                  <h2 className="mt-3 text-xl font-bold text-emerald-950">{service.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-emerald-950/65">{service.description}</p>
                  <p className="mt-5 text-sm font-bold text-emerald-700">Buka layanan →</p>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <EmptyState className="md:col-span-3" message={settingValue(settings, 'empty.services')} />
        )}
      </div>
    </section>
  )
}
