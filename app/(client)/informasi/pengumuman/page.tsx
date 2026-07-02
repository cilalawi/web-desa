import { AnnouncementCard } from '@/components/public/AnnouncementCard'
import { EmptyState } from '@/components/public/EmptyState'
import { PageHero } from '@/components/public/PageHero'
import { prisma } from '@/lib/prisma'
import { getSiteSettings, settingValue } from '@/lib/site-settings'

export default async function PengumumanPage() {
  const [announcements, settings] = await Promise.all([
    prisma.announcement.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
    }),
    getSiteSettings(['empty.announcements']),
  ])

  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <PageHero eyebrow="Informasi" title="Pengumuman Desa" description="Daftar pengumuman resmi Pemerintah Desa Cilalawi untuk warga." />
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {announcements.length ? (
          announcements.map((item) => (
            <AnnouncementCard
              key={item.id}
              title={item.title}
              date={item.publishedAt?.toLocaleDateString('id-ID', { dateStyle: 'medium' }) ?? 'Belum terbit'}
              href="/informasi/pengumuman"
              summary={item.summary}
            />
          ))
        ) : (
          <EmptyState className="md:col-span-3" message={settingValue(settings, 'empty.announcements')} />
        )}
      </div>
    </section>
  )
}
