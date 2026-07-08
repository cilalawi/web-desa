import type { Metadata } from 'next'
import { PageHero } from '@/components/public/PageHero'
import { Card, CardContent } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'
import { getSiteSettings, settingValue } from '@/lib/site-settings'

export const metadata: Metadata = {
  title: 'Hubungi Kami - Kantor Pemerintah Desa Cilalawi',
  description: 'Hubungi Kantor Pemerintah Desa Cilalawi. Temukan alamat resmi, nomor telepon layanan, email, dan jam operasional pelayanan warga.',
}

export default async function KontakPage() {
  const [profile, settings] = await Promise.all([
    prisma.villageProfile.findFirst({ where: { name: 'Desa Cilalawi' } }),
    getSiteSettings(['empty.contactAddress', 'empty.contactPhone', 'empty.contactEmail', 'contact.serviceHours']),
  ])

  const contacts = [
    { label: 'Alamat Kantor Desa', value: profile?.address ?? settingValue(settings, 'empty.contactAddress') },
    { label: 'Telepon', value: profile?.phone ?? settingValue(settings, 'empty.contactPhone') },
    { label: 'Email', value: profile?.email ?? settingValue(settings, 'empty.contactEmail') },
    { label: 'Jam Layanan', value: settingValue(settings, 'contact.serviceHours') },
  ]

  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <PageHero eyebrow="Kontak" title="Kontak Desa" description="Informasi kanal komunikasi dan layanan Kantor Desa Cilalawi." />
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {contacts.map((item) => (
          <Card key={item.label} className="border-emerald-900/10 bg-white shadow-sm shadow-emerald-900/5">
            <CardContent className="p-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">{item.label}</p>
              <p className="mt-3 text-sm leading-6 text-emerald-950/70">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
