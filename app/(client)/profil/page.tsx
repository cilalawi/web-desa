import Link from 'next/link'
import type { Metadata } from 'next'
import { EmptyState } from '@/components/public/EmptyState'
import { PageHero } from '@/components/public/PageHero'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'
import { getSiteSettings, settingValue } from '@/lib/site-settings'

export const metadata: Metadata = {
  title: 'Profil Desa Cilalawi - Portal Resmi',
  description: 'Kenali lebih dekat wilayah, profil, dan data administrasi Desa Cilalawi, Kecamatan Sukatani, Kabupaten Purwakarta.',
}

export default async function ProfilPage() {
  const [profile, settings] = await Promise.all([
    prisma.villageProfile.findFirst({ where: { name: 'Desa Cilalawi' } }),
    getSiteSettings(['empty.profileDetail']),
  ])

  const details = [
    { label: 'Alamat Kantor Desa', value: profile?.address },
    { label: 'Telepon', value: profile?.phone },
    { label: 'Email', value: profile?.email },
  ].filter((item) => item.value)

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <PageHero eyebrow="Profil" title="Profil Desa" description={profile?.description ?? 'Informasi umum Pemerintah Desa Cilalawi.'} />
      <div className="mt-5 grid gap-3 md:mt-8 md:grid-cols-3 md:gap-5">
        {details.length ? (
          details.map((item) => (
            <Card key={item.label} className="border-emerald-900/10 bg-white shadow-sm shadow-emerald-900/5">
              <CardContent className="p-4 md:p-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700 md:text-xs md:tracking-[0.18em]">{item.label}</p>
                <p className="mt-2 text-xs leading-5 text-emerald-950/70 md:mt-3 md:text-sm md:leading-6">{item.value}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <EmptyState className="md:col-span-3" message={settingValue(settings, 'empty.profileDetail')} />
        )}
      </div>
      <Card className="mt-5 border-emerald-900/10 bg-emerald-900 text-white shadow-md shadow-emerald-900/10 md:mt-8 md:shadow-lg md:shadow-emerald-900/15">
        <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between md:gap-5 md:p-7">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-lime-200 md:text-xs md:tracking-[0.2em]">Pemerintahan Desa</p>
            <h2 className="mt-2 text-xl font-black md:mt-3 md:text-2xl">Aparatur Desa Cilalawi</h2>
            <p className="mt-1.5 max-w-2xl text-xs leading-5 text-emerald-50/85 md:mt-2 md:text-sm md:leading-6">
              Lihat daftar perangkat desa, jabatan, dan struktur pelayanan yang bertugas melayani masyarakat.
            </p>
          </div>
          <Button asChild className="h-9 w-fit rounded-full bg-white text-xs text-emerald-900 hover:bg-emerald-50 md:h-10 md:text-sm">
            <Link href="/profil/aparatur">Lihat Aparatur Desa</Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  )
}
