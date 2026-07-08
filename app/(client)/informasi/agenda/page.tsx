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
    <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <PageHero eyebrow="Informasi" title="Agenda Desa" description="Jadwal kegiatan, musyawarah, dan acara resmi Desa Cilalawi." />
      <div className="mt-5 grid gap-3 md:mt-8 md:gap-5">
        {agenda.length ? (
          agenda.map((item) => (
            <Card key={item.id} className="border-emerald-900/10 bg-white shadow-sm shadow-emerald-900/5">
              <CardContent className="grid gap-3 p-4 md:grid-cols-[1fr_auto] md:items-center md:gap-4 md:p-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700 md:text-xs md:tracking-[0.18em]">Agenda Desa</p>
                  <h2 className="mt-1.5 text-base font-bold text-emerald-950 md:mt-2 md:text-xl">{item.title}</h2>
                  <p className="mt-1.5 text-xs leading-5 text-emerald-950/65 md:mt-2 md:text-sm md:leading-6">{item.description}</p>
                  {item.location ? <p className="mt-2 text-xs font-medium text-emerald-800 md:mt-3 md:text-sm">Lokasi: {item.location}</p> : null}
                </div>
                {item.startsAt ? (
                  <p className="rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800 md:rounded-2xl md:px-4 md:py-3 md:text-sm">
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
