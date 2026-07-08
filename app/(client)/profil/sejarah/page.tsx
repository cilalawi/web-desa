import type { Metadata } from 'next'
import { EmptyState } from '@/components/public/EmptyState'
import { PageHero } from '@/components/public/PageHero'
import { Card, CardContent } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'
import { getSiteSettings, settingValue } from '@/lib/site-settings'

export const metadata: Metadata = {
  title: 'Sejarah Desa Cilalawi - Portal Resmi',
  description: 'Mengenal asal-usul, sejarah, perkembangan wilayah, dan warisan budaya Desa Cilalawi.',
}

export default async function SejarahPage() {
  const [setting, settings] = await Promise.all([
    prisma.siteSetting.findUnique({ where: { key: 'sejarah-desa' } }),
    getSiteSettings(['empty.history']),
  ])

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 md:py-14">
      <PageHero eyebrow="Profil" title="Sejarah Desa" description="Asal-usul, perkembangan wilayah, dan cerita Desa Cilalawi." />
      {setting?.value ? (
        <Card className="mt-5 border-emerald-900/10 bg-white shadow-sm shadow-emerald-900/5 md:mt-8">
          <CardContent className="p-4 md:p-7">
            <div className="max-w-none whitespace-pre-line text-sm leading-7 text-emerald-950/75 md:text-base md:leading-8">{setting.value}</div>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-5 md:mt-8">
          <EmptyState message={settingValue(settings, 'empty.history')} />
        </div>
      )}
    </section>
  )
}
