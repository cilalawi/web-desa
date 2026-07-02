import Image from 'next/image'
import Link from 'next/link'
import { AnnouncementCard } from '@/components/public/AnnouncementCard'
import { MotionBlock, MotionItem } from '@/components/public/Motion'
import { NewsCard } from '@/components/public/NewsCard'
import { SectionHeader } from '@/components/public/SectionHeader'
import { StatCard } from '@/components/public/StatCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getHomeData } from '@/lib/home-data'
import { settingValue } from '@/lib/site-settings'

const serviceHref: Record<string, string> = {
  'pengaduan-warga': '/layanan/pengaduan',
  'informasi-desa': '/informasi/pengumuman',
  'transparansi-publik': '/informasi/statistik',
}

const quickLinks = [
  { label: 'Pengaduan Warga', description: 'Sampaikan laporan dan kebutuhan layanan desa.', href: '/layanan/pengaduan' },
  { label: 'Pengumuman', description: 'Informasi resmi terbaru untuk masyarakat.', href: '/informasi/pengumuman' },
  { label: 'Profil Desa', description: 'Kenali pemerintahan dan wilayah desa.', href: '/profil' },
  { label: 'Kontak Kantor', description: 'Temukan kanal komunikasi pemerintah desa.', href: '/kontak' },
]

function formatDate(date: Date | null) {
  return date ? date.toLocaleDateString('id-ID', { dateStyle: 'medium' }) : 'Belum terbit'
}

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'AP'
}

export default async function HomePage() {
  const { profile, statistics, services, announcements, newsItems, officials, mediaAsset, budgetItems, settings } = await getHomeData()
  const copy = (key: string) => settingValue(settings, key)

  return (
    <>
      <section className="relative overflow-hidden border-b border-emerald-900/10 bg-[linear-gradient(135deg,rgba(236,253,245,0.95),rgba(255,251,235,0.95))]">
        <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_20%_20%,rgba(132,204,22,0.24),transparent_36rem)]" />
        <div className="relative mx-auto grid min-h-[calc(100dvh-8rem)] max-w-7xl gap-10 px-4 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-20">
          <div>
            <MotionItem>
              <p className="inline-flex rounded-full border border-emerald-800/15 bg-white/85 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-emerald-800 shadow-sm">
                {profile.tagline || 'Portal Resmi Desa'}
              </p>
            </MotionItem>
            <MotionItem delay={0.08}>
              <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[0.95] tracking-tight text-emerald-950 text-balance md:text-7xl">
                {copy('home.hero.title')}
              </h1>
            </MotionItem>
            <MotionItem delay={0.16}>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-emerald-950/70">{profile.description}</p>
            </MotionItem>
            <MotionItem delay={0.24}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild className="h-12 rounded-full bg-emerald-700 px-6 text-sm font-semibold text-white shadow-lg shadow-emerald-900/15 hover:bg-emerald-800">
                  <Link href={copy('home.hero.primaryCtaHref')}>{copy('home.hero.primaryCtaLabel')}</Link>
                </Button>
                <Button asChild variant="outline" className="h-12 rounded-full border-emerald-900/15 bg-white px-6 text-sm font-semibold text-emerald-900 hover:bg-emerald-50">
                  <Link href={copy('home.hero.secondaryCtaHref')}>{copy('home.hero.secondaryCtaLabel')}</Link>
                </Button>
              </div>
            </MotionItem>

            <MotionItem delay={0.32}>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {quickLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-3xl border border-emerald-900/10 bg-white/80 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
                  >
                    <p className="font-bold text-emerald-950">{item.label}</p>
                    <p className="mt-1 text-sm leading-6 text-emerald-950/65">{item.description}</p>
                  </Link>
                ))}
              </div>
            </MotionItem>
          </div>

          <MotionItem delay={0.18}>
            <div className="relative">
              <Card className="overflow-hidden rounded-[2rem] border-white/70 bg-white/80 p-2 shadow-2xl shadow-emerald-900/15 backdrop-blur">
                <Image
                  src={copy('home.hero.imageUrl')}
                  alt={copy('home.hero.imageAlt')}
                  width={1100}
                  height={820}
                  preload
                  className="aspect-[4/3] w-full rounded-[1.5rem] object-cover"
                />
              </Card>
              <Card className="absolute -bottom-6 left-6 right-6 border-emerald-900/10 bg-white/95 shadow-xl shadow-emerald-900/15 backdrop-blur md:left-auto md:w-80">
                <CardContent className="p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Pusat Layanan Desa</p>
                  <p className="mt-2 text-sm leading-6 text-emerald-950/70">
                    Informasi publik, layanan warga, berita, dan agenda desa tersaji dalam satu portal resmi.
                  </p>
                </CardContent>
              </Card>
            </div>
          </MotionItem>
        </div>
      </section>

      <MotionBlock className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <SectionHeader eyebrow="Data Desa" title="Ringkasan informasi desa" description="Ikhtisar data penting yang dipublikasikan melalui kanal resmi desa." />
          <Button asChild variant="outline" className="w-fit rounded-full border-emerald-900/15 bg-white text-emerald-900 hover:bg-emerald-50">
            <Link href="/informasi/statistik">Lihat data statistik</Link>
          </Button>
        </div>
        {statistics.length ? (
          <div className="grid gap-4 md:grid-cols-4">
            {statistics.map((stat) => (
              <StatCard key={stat.id} label={stat.label} value={stat.value} />
            ))}
          </div>
        ) : (
          <Card className="border-emerald-900/10 bg-white">
            <CardContent className="p-6">
              <p className="font-medium text-emerald-950/70">{copy('empty.statistics')}</p>
            </CardContent>
          </Card>
        )}
      </MotionBlock>

      <MotionBlock className="bg-white/70 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="lg:sticky lg:top-32">
            <SectionHeader
              eyebrow={copy('home.announcements.eyebrow')}
              title={copy('home.announcements.title')}
              description={copy('home.announcements.description')}
            />
            <Button asChild className="mt-7 rounded-full bg-emerald-700 text-white hover:bg-emerald-800">
              <Link href="/informasi/pengumuman">Lihat semua pengumuman</Link>
            </Button>
          </div>
          <div className="grid gap-5 md:grid-cols-3 lg:grid-cols-1">
            {announcements.length ? (
              announcements.map((item) => (
                <AnnouncementCard
                  key={item.id}
                  title={item.title}
                  date={formatDate(item.publishedAt)}
                  href="/informasi/pengumuman"
                  summary={item.summary}
                />
              ))
            ) : (
              <Card className="border-emerald-900/10 bg-white">
                <CardContent className="p-6">{copy('empty.announcements')}</CardContent>
              </Card>
            )}
          </div>
        </div>
      </MotionBlock>

      <MotionBlock className="mx-auto grid max-w-7xl gap-10 px-4 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <Card className="overflow-hidden rounded-[2rem] border-emerald-900/10 bg-white p-3 shadow-lg shadow-emerald-900/10">
          <Image src={copy('home.services.imageUrl')} alt={copy('home.services.imageAlt')} width={760} height={560} className="h-auto w-full rounded-[1.5rem]" />
        </Card>
        <div>
          <SectionHeader
            eyebrow={copy('home.services.eyebrow')}
            title={copy('home.services.title')}
            description={copy('home.services.description')}
          />
          <div className="mt-8 grid gap-4 md:grid-cols-3 lg:grid-cols-1">
            {services.map((service) => (
              <Card key={service.id} className="border-emerald-900/10 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-emerald-950">{service.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-emerald-950/65">{service.description}</p>
                  </div>
                  <Button asChild variant="outline" className="shrink-0 rounded-full border-emerald-900/15 bg-white text-emerald-900 hover:bg-emerald-50">
                    <Link href={serviceHref[service.slug] ?? `/layanan/${service.slug}`}>Buka layanan</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </MotionBlock>

      <MotionBlock className="mx-auto max-w-7xl px-4 py-20">
        <Card className="overflow-hidden rounded-[2rem] border-emerald-900/10 bg-emerald-900 text-white shadow-xl shadow-emerald-900/15">
          <CardContent className="grid gap-8 p-8 md:grid-cols-[0.72fr_1.28fr] md:p-10">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-lime-200">{copy('home.welcome.eyebrow')}</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">{copy('home.welcome.title')}</h2>
            </div>
            <div>
              <p className="text-xl font-bold text-white">{copy('home.welcome.heading')}</p>
              <p className="mt-4 leading-8 text-emerald-50/85">{copy('home.welcome.body')}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild className="rounded-full bg-white text-emerald-900 hover:bg-emerald-50">
                  <Link href="/profil">Profil desa</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full border-white/30 bg-transparent text-white hover:bg-white/10">
                  <Link href="/profil/aparatur">Aparatur desa</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </MotionBlock>

      {officials.length ? (
        <MotionBlock className="mx-auto max-w-7xl px-4 py-20">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <SectionHeader
              eyebrow="Aparatur Desa"
              title="Perangkat desa yang melayani warga"
              description="Kenali aparatur Pemerintah Desa Cilalawi yang bertugas mengelola administrasi, pelayanan publik, dan kegiatan pemerintahan desa."
            />
            <Button asChild variant="outline" className="w-fit rounded-full border-emerald-900/15 bg-white text-emerald-900 hover:bg-emerald-50">
              <Link href="/profil/aparatur">Lihat semua aparatur</Link>
            </Button>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {officials.map((official) => {
              const photo = official.photoAssetId ? mediaAsset.get(official.photoAssetId) : null
              return (
                <Card key={official.id} className="border-emerald-900/10 bg-white shadow-sm shadow-emerald-900/5 transition-all hover:-translate-y-1 hover:shadow-lg">
                  <CardContent className="p-5">
                    {photo ? (
                      <Image src={photo.url} alt={photo.alt} width={360} height={360} className="mb-5 aspect-square rounded-[1.5rem] object-cover" />
                    ) : (
                      <div className="mb-5 grid aspect-square place-items-center rounded-[1.5rem] border border-emerald-900/10 bg-gradient-to-br from-emerald-100 to-lime-100 text-4xl font-black text-emerald-800 shadow-inner">
                        {initials(official.name)}
                      </div>
                    )}
                    <p className="text-lg font-bold text-emerald-950">{official.name}</p>
                    <p className="mt-1 text-sm font-semibold text-emerald-700">{official.position}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </MotionBlock>
      ) : null}

      <MotionBlock className="mx-auto max-w-7xl px-4 py-20">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <SectionHeader
            eyebrow={copy('home.news.eyebrow')}
            title={copy('home.news.title')}
            description={copy('home.news.description')}
          />
          <Button asChild variant="outline" className="w-fit rounded-full border-emerald-900/15 bg-white text-emerald-900 hover:bg-emerald-50">
            <Link href="/berita">Lihat semua berita</Link>
          </Button>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {newsItems.length ? (
            newsItems.map((item) => (
              <NewsCard
                key={item.id}
                title={item.title}
                slug={item.slug}
                excerpt={item.excerpt}
                image={item.coverAssetId ? mediaAsset.get(item.coverAssetId) : null}
              />
            ))
          ) : (
            <Card className="border-emerald-900/10 bg-white md:col-span-3">
              <CardContent className="p-6">{copy('empty.news')}</CardContent>
            </Card>
          )}
        </div>
      </MotionBlock>

      <MotionBlock className="bg-white/70 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <SectionHeader
              eyebrow={copy('home.budget.eyebrow')}
              title={copy('home.budget.title')}
              description={copy('home.budget.description')}
            />
            <div className="mt-8 grid gap-4">
              {budgetItems.length ? (
                budgetItems.map((item) => (
                  <Card key={item.id} className="border-emerald-900/10 bg-white shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg font-bold text-emerald-950">{item.label}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm font-medium leading-6 text-emerald-950/65">{item.value}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="border-emerald-900/10 bg-white">
                  <CardContent className="p-6">{copy('empty.budget')}</CardContent>
                </Card>
              )}
            </div>
          </div>
          <Card className="overflow-hidden rounded-[2rem] border-emerald-900/10 bg-white p-3 shadow-lg shadow-emerald-900/10">
            <Image src={copy('home.budget.imageUrl')} alt={copy('home.budget.imageAlt')} width={760} height={560} className="h-auto w-full rounded-[1.5rem]" />
          </Card>
        </div>
      </MotionBlock>
    </>
  )
}
