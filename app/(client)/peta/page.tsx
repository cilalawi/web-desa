import type { Metadata } from 'next'
import { EmptyState } from '@/components/public/EmptyState'
import { PageHero } from '@/components/public/PageHero'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'
import { getSiteSettings, settingValue } from '@/lib/site-settings'

export const metadata: Metadata = {
  title: 'Peta Wilayah & Lokasi Desa Cilalawi - Portal Resmi',
  description: 'Peta wilayah administratif Desa Cilalawi, Sukatani, Purwakarta. Temukan lokasi Kantor Desa dan titik-titik penting pelayanan warga.',
}

export default async function PetaPage() {
  const [profile, statistics, settings] = await Promise.all([
    prisma.villageProfile.findFirst({ where: { name: 'Desa Cilalawi' } }),
    prisma.statistic.findMany({
      where: { status: 'PUBLISHED' },
    }),
    getSiteSettings(['empty.map']),
  ])

  // Get boundaries and area from Statistic table dynamically
  const getStat = (label: string) => statistics.find((s) => s.label === label)
  const luasWilayah = getStat('Luas Wilayah')
  const batasUtara = getStat('Batas Utara')
  const batasSelatan = getStat('Batas Selatan')
  const batasBarat = getStat('Batas Barat')
  const batasTimur = getStat('Batas Timur')

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 md:py-14 space-y-6 md:space-y-10">
      <PageHero eyebrow="Peta" title="Peta Desa" description="Lokasi kantor desa, batas wilayah, dan daerah layanan Pemerintah Desa Cilalawi." />

      {profile?.mapUrl ? (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Map Container */}
          <div className="md:col-span-2 overflow-hidden rounded-[1.35rem] border border-emerald-900/10 bg-white p-1.5 shadow-md shadow-emerald-900/5 md:rounded-[2rem] md:p-2 md:shadow-lg md:shadow-emerald-900/10">
            <iframe
              src={profile.mapUrl}
              title="Peta Desa Cilalawi"
              className="h-[24rem] w-full rounded-[1rem] border-0 md:h-[32rem] md:rounded-[1.5rem]"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Details & Boundaries */}
          <div className="space-y-6 flex flex-col justify-between">
            {/* Info Card */}
            <Card className="border-emerald-900/10 bg-white/70 shadow-sm backdrop-blur">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-black text-emerald-950 uppercase tracking-[0.12em]">Detail Wilayah</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3.5 rounded-xl border border-emerald-900/5 bg-emerald-50/10">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">Luas Wilayah</span>
                  <p className="text-xl font-black text-emerald-950 mt-1">{luasWilayah?.value || '284,14 Ha'}</p>
                </div>
                <div className="p-3.5 rounded-xl border border-emerald-900/5 bg-emerald-50/10">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">Kecamatan</span>
                  <p className="text-base font-black text-emerald-950 mt-1">Sukatani</p>
                </div>
                <div className="p-3.5 rounded-xl border border-emerald-900/5 bg-emerald-50/10">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">Kabupaten</span>
                  <p className="text-base font-black text-emerald-950 mt-1">Purwakarta</p>
                </div>
              </CardContent>
            </Card>

            {/* Boundaries Card */}
            <Card className="border-emerald-900/10 bg-white/70 shadow-sm backdrop-blur flex-1 flex flex-col justify-between">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-black text-emerald-950 uppercase tracking-[0.12em]">Batas Wilayah</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <div className="flex items-center justify-between border-b border-emerald-900/5 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex size-6 items-center justify-center rounded bg-emerald-100 text-[10px] font-black text-emerald-800">U</span>
                    <span className="text-xs font-extrabold text-emerald-950/70">Utara</span>
                  </div>
                  <span className="text-xs font-black text-emerald-950">{batasUtara?.value || 'Desa Sukajaya'}</span>
                </div>
                <div className="flex items-center justify-between border-b border-emerald-900/5 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex size-6 items-center justify-center rounded bg-emerald-100 text-[10px] font-black text-emerald-800">S</span>
                    <span className="text-xs font-extrabold text-emerald-950/70">Selatan</span>
                  </div>
                  <span className="text-xs font-black text-emerald-950">{batasSelatan?.value || 'Desa Malangnengah'}</span>
                </div>
                <div className="flex items-center justify-between border-b border-emerald-900/5 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex size-6 items-center justify-center rounded bg-emerald-100 text-[10px] font-black text-emerald-800">B</span>
                    <span className="text-xs font-extrabold text-emerald-950/70">Barat</span>
                  </div>
                  <span className="text-xs font-black text-emerald-950">{batasBarat?.value || 'Desa Cibodas'}</span>
                </div>
                <div className="flex items-center justify-between pb-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex size-6 items-center justify-center rounded bg-emerald-100 text-[10px] font-black text-emerald-800">T</span>
                    <span className="text-xs font-extrabold text-emerald-950/70">Timur</span>
                  </div>
                  <span className="text-xs font-black text-emerald-950">{batasTimur?.value || 'Desa Sukatani'}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="mt-5 md:mt-8">
          <EmptyState message={settingValue(settings, 'empty.map')} />
        </div>
      )}
    </section>
  )
}
