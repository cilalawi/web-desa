import Link from 'next/link'
import { EmptyState } from '@/components/public/EmptyState'
import { PageHero } from '@/components/public/PageHero'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'
import { getSiteSettings, settingValue } from '@/lib/site-settings'

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
    <section className="mx-auto max-w-6xl px-4 py-14">
      <PageHero eyebrow="Profil" title="Profil Desa" description={profile?.description ?? 'Informasi umum Pemerintah Desa Cilalawi.'} />
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {details.length ? (
          details.map((item) => (
            <Card key={item.label} className="border-emerald-900/10 bg-white shadow-sm shadow-emerald-900/5">
              <CardContent className="p-6">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">{item.label}</p>
                <p className="mt-3 text-sm leading-6 text-emerald-950/70">{item.value}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <EmptyState className="md:col-span-3" message={settingValue(settings, 'empty.profileDetail')} />
        )}
      </div>
      <Card className="mt-8 border-emerald-900/10 bg-emerald-900 text-white shadow-lg shadow-emerald-900/15">
        <CardContent className="flex flex-col gap-5 p-7 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime-200">Pemerintahan Desa</p>
            <h2 className="mt-3 text-2xl font-black">Aparatur Desa Cilalawi</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-emerald-50/85">
              Lihat daftar perangkat desa, jabatan, dan struktur pelayanan yang bertugas melayani masyarakat.
            </p>
          </div>
          <Button asChild className="w-fit rounded-full bg-white text-emerald-900 hover:bg-emerald-50">
            <Link href="/profil/aparatur">Lihat Aparatur Desa</Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  )
}
