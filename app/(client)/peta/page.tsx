import type { Metadata } from 'next'
import { EmptyState } from '@/components/public/EmptyState'
import { PageHero } from '@/components/public/PageHero'
import { prisma } from '@/lib/prisma'
import { getSiteSettings, settingValue } from '@/lib/site-settings'

export const metadata: Metadata = {
  title: 'Peta Wilayah & Lokasi Desa Cilalawi - Portal Resmi',
  description: 'Peta wilayah administratif Desa Cilalawi, Sukatani, Purwakarta. Temukan lokasi Kantor Desa dan titik-titik penting pelayanan warga.',
}

export default async function PetaPage() {
  const [profile, settings] = await Promise.all([
    prisma.villageProfile.findFirst({ where: { name: 'Desa Cilalawi' } }),
    getSiteSettings(['empty.map']),
  ])

  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <PageHero eyebrow="Peta" title="Peta Desa" description="Lokasi kantor desa dan wilayah layanan Pemerintah Desa Cilalawi." />
      {profile?.mapUrl ? (
        <div className="mt-8 overflow-hidden rounded-[2rem] border border-emerald-900/10 bg-white p-2 shadow-lg shadow-emerald-900/10">
          <iframe
            src={profile.mapUrl}
            title="Peta Desa Cilalawi"
            className="h-[30rem] w-full rounded-[1.5rem] border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      ) : (
        <div className="mt-8">
          <EmptyState message={settingValue(settings, 'empty.map')} />
        </div>
      )}
    </section>
  )
}
