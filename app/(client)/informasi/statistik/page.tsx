import { EmptyState } from '@/components/public/EmptyState'
import { PageHero } from '@/components/public/PageHero'
import { StatCard } from '@/components/public/StatCard'
import { prisma } from '@/lib/prisma'
import { getSiteSettings, settingValue } from '@/lib/site-settings'

export default async function StatistikPage() {
  const [statistics, settings] = await Promise.all([
    prisma.statistic.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { order: 'asc' },
    }),
    getSiteSettings(['empty.statistics']),
  ])

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <PageHero eyebrow="Informasi" title="Data Statistik" description="Ringkasan data penduduk, wilayah, dan potensi Desa Cilalawi." />
      <div className="mt-5 grid gap-3 md:mt-8 md:grid-cols-4 md:gap-5">
        {statistics.length ? (
          statistics.map((stat) => <StatCard key={stat.id} label={stat.label} value={stat.value} />)
        ) : (
          <EmptyState className="md:col-span-4" message={settingValue(settings, 'empty.statistics')} />
        )}
      </div>
    </section>
  )
}
