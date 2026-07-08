import Link from 'next/link'
import type { Metadata } from 'next'
import { EmptyState } from '@/components/public/EmptyState'
import { PageHero } from '@/components/public/PageHero'
import { Card, CardContent } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'
import { getSiteSettings, settingValue } from '@/lib/site-settings'

export const metadata: Metadata = {
  title: 'Layanan Publik Desa Cilalawi - Portal Resmi',
  description: 'Temukan informasi persyaratan dan pengurusan administrasi kependudukan serta pengaduan warga di Desa Cilalawi.',
}

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
    <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <PageHero eyebrow="Layanan" title="Layanan Warga" description="Akses kanal layanan desa yang tersedia untuk warga secara jelas dan tertib." />
      <div className="mt-5 grid gap-3 md:mt-8 md:grid-cols-3 md:gap-5">
        {services.length ? (
          services.map((service) => (
            <Link key={service.id} href={serviceHref[service.slug] ?? `/layanan/${service.slug}`} className="block h-full">
              <Card className="h-full border-emerald-900/10 bg-white shadow-sm shadow-emerald-900/5 transition-all hover:-translate-y-1 hover:border-emerald-700/25 hover:shadow-lg">
                <CardContent className="p-4 md:p-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700 md:text-xs md:tracking-[0.18em]">Layanan Desa</p>
                  <h2 className="mt-2 text-lg font-bold text-emerald-950 md:mt-3 md:text-xl">{service.title}</h2>
                  <p className="mt-2 text-xs leading-5 text-emerald-950/65 md:mt-3 md:text-sm md:leading-6">{service.description}</p>
                  <p className="mt-3 text-xs font-bold text-emerald-700 md:mt-5 md:text-sm">Buka layanan →</p>
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
