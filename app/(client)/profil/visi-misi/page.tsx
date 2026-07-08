import type { Metadata } from 'next'
import { PageHero } from '@/components/public/PageHero'
import { Card, CardContent } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'
import { getSiteSettings, settingValue } from '@/lib/site-settings'

export const metadata: Metadata = {
  title: 'Visi & Misi Desa Cilalawi - Portal Resmi',
  description: 'Visi dan Misi arah pembangunan serta pelayanan Pemerintah Desa Cilalawi untuk kesejahteraan masyarakat.',
}

export default async function VisiMisiPage() {
  const [visi, misi, settings] = await Promise.all([
    prisma.siteSetting.findUnique({ where: { key: 'visi' } }),
    prisma.siteSetting.findUnique({ where: { key: 'misi' } }),
    getSiteSettings(['visi', 'misi']),
  ])

  const items = [
    { title: 'Visi', value: visi?.value ?? settingValue(settings, 'visi') },
    { title: 'Misi', value: misi?.value ?? settingValue(settings, 'misi') },
  ]

  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <PageHero eyebrow="Profil" title="Visi & Misi" description="Arah pembangunan dan pelayanan Pemerintah Desa Cilalawi." />
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {items.map((item) => (
          <Card key={item.title} className="border-emerald-900/10 bg-white shadow-sm shadow-emerald-900/5">
            <CardContent className="p-7">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">{item.title}</p>
              <p className="mt-4 whitespace-pre-line text-base leading-8 text-emerald-950/75">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
