import { EmptyState } from '@/components/public/EmptyState'
import { PageHero } from '@/components/public/PageHero'
import { Card, CardContent } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'
import { getSiteSettings, settingValue } from '@/lib/site-settings'

export default async function AgendaPage() {
  const [agenda, settings] = await Promise.all([
    prisma.agenda.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { startsAt: 'asc' },
    }),
    getSiteSettings(['empty.agenda']),
  ])

  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <PageHero eyebrow="Informasi" title="Agenda Desa" description="Jadwal kegiatan, musyawarah, dan acara resmi Desa Cilalawi." />
      <div className="mt-8 grid gap-5">
        {agenda.length ? (
          agenda.map((item) => (
            <Card key={item.id} className="border-emerald-900/10 bg-white shadow-sm shadow-emerald-900/5">
              <CardContent className="grid gap-4 p-6 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Agenda Desa</p>
                  <h2 className="mt-2 text-xl font-bold text-emerald-950">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-emerald-950/65">{item.description}</p>
                  {item.location ? <p className="mt-3 text-sm font-medium text-emerald-800">Lokasi: {item.location}</p> : null}
                </div>
                {item.startsAt ? (
                  <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
                    {item.startsAt.toLocaleDateString('id-ID', { dateStyle: 'full' })}
                  </p>
                ) : null}
              </CardContent>
            </Card>
          ))
        ) : (
          <EmptyState message={settingValue(settings, 'empty.agenda')} />
        )}
      </div>
    </section>
  )
}
