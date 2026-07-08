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
    <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <PageHero eyebrow="Kontak" title="Kontak Desa" description="Informasi kanal komunikasi dan layanan Kantor Desa Cilalawi." />
      <div className="mt-5 grid gap-3 md:mt-8 md:grid-cols-2 md:gap-5">
        {contacts.map((item) => (
          <Card key={item.label} className="border-emerald-900/10 bg-white shadow-sm shadow-emerald-900/5">
            <CardContent className="p-4 md:p-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700 md:text-xs md:tracking-[0.18em]">{item.label}</p>
              <p className="mt-2 text-xs leading-5 text-emerald-950/70 md:mt-3 md:text-sm md:leading-6">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
