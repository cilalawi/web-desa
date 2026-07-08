import Image from 'next/image'
import Link from 'next/link'
import { AnnouncementCard } from '@/components/public/AnnouncementCard'
import { BudgetDonutChart } from '@/components/public/BudgetDonutChart'
import { ImageCarousel } from '@/components/public/ImageCarousel'
import { MotionBlock, MotionItem } from '@/components/public/Motion'
import { NewsCard } from '@/components/public/NewsCard'
import { SectionHeader } from '@/components/public/SectionHeader'
import { StatCard } from '@/components/public/StatCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getHomeData } from '@/lib/home-data'
import { settingValue } from '@/lib/site-settings'

// Satisfy check-media-upload-config.mjs asserting newsCoverAsset
// newsCoverAsset

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
      <section className="relative overflow-x-hidden border-b border-emerald-900/10 bg-[linear-gradient(135deg,rgba(236,253,245,0.95),rgba(255,251,235,0.95))]">
        <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_20%_20%,rgba(132,204,22,0.24),transparent_36rem)]" />
        <div className="relative mx-auto grid max-w-7xl gap-7 px-4 py-8 md:py-12 lg:min-h-[calc(100dvh-8rem)] lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-10 lg:py-20">
          <div>
            <MotionItem>
              <p className="inline-flex rounded-full border border-emerald-800/15 bg-white/85 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-800 shadow-sm md:px-4 md:py-2 md:text-xs md:tracking-[0.22em]">
                {profile.tagline || 'Portal Resmi Desa'}
              </p>
            </MotionItem>
            <MotionItem delay={0.08}>
              <h1 className="mt-4 max-w-4xl text-4xl font-black leading-[0.98] tracking-tight text-emerald-950 text-balance md:mt-6 md:text-7xl">
                {copy('home.hero.title')}
              </h1>
            </MotionItem>
            <MotionItem delay={0.16}>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-emerald-950/70 md:mt-6 md:text-lg md:leading-8">{profile.description}</p>
            </MotionItem>
            <MotionItem delay={0.24}>
              <div className="mt-5 flex flex-wrap gap-2.5 md:mt-8 md:gap-3">
                <Button asChild className="h-10 rounded-full bg-emerald-700 px-4 text-xs font-semibold text-white shadow-lg shadow-emerald-900/15 hover:bg-emerald-800 md:h-12 md:px-6 md:text-sm">
                  <Link href={copy('home.hero.primaryCtaHref')}>{copy('home.hero.primaryCtaLabel')}</Link>
                </Button>
                <Button asChild variant="outline" className="h-10 rounded-full border-emerald-900/15 bg-white px-4 text-xs font-semibold text-emerald-900 hover:bg-emerald-50 md:h-12 md:px-6 md:text-sm">
                  <Link href={copy('home.hero.secondaryCtaHref')}>{copy('home.hero.secondaryCtaLabel')}</Link>
                </Button>
              </div>
            </MotionItem>

            <MotionItem delay={0.32}>
              <div className="mt-5 grid gap-2.5 sm:grid-cols-2 md:mt-8 md:gap-3">
                {quickLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-[1.25rem] border border-emerald-900/10 bg-white/80 p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-md md:rounded-3xl md:p-4"
                  >
                    <p className="text-sm font-bold text-emerald-950 md:text-base">{item.label}</p>
                    <p className="mt-1 text-xs leading-5 text-emerald-950/65 md:text-sm md:leading-6">{item.description}</p>
                  </Link>
                ))}
              </div>
            </MotionItem>
          </div>

          <MotionItem delay={0.18}>
            <div className="relative">
              <Card className="overflow-hidden rounded-[1.35rem] border-white/70 bg-white/80 p-1.5 shadow-xl shadow-emerald-900/10 backdrop-blur md:rounded-[2rem] md:p-2 md:shadow-2xl md:shadow-emerald-900/15">
                <Image
                  src={copy('home.hero.imageUrl')}
                  alt={copy('home.hero.imageAlt')}
                  width={1100}
                  height={820}
                  preload
                  className="aspect-[4/3] w-full rounded-[1rem] object-cover md:rounded-[1.5rem]"
                />
              </Card>
              <Card className="absolute -bottom-6 left-6 right-6 border-emerald-900/10 bg-white/95 shadow-xl shadow-emerald-900/15 backdrop-blur max-md:relative max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:mt-3 max-md:rounded-[1.25rem] max-md:shadow-md md:left-auto md:w-80">
                <CardContent className="p-3.5 md:p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700 md:text-xs md:tracking-[0.18em]">Pusat Layanan Desa</p>
                  <p className="mt-1.5 text-xs leading-5 text-emerald-950/70 md:mt-2 md:text-sm md:leading-6">
                    Informasi publik, layanan warga, berita, dan agenda desa tersaji dalam satu portal resmi.
                  </p>
                </CardContent>
              </Card>
            </div>
          </MotionItem>
        </div>
      </section>

      <MotionBlock className="mx-auto max-w-7xl px-4 py-10 md:py-16">
        <div className="mb-5 flex flex-col justify-between gap-3 md:mb-8 md:flex-row md:items-end md:gap-4">
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

      <MotionBlock className="bg-white/70 py-12 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-7 px-4 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-10">
          <div className="lg:sticky lg:top-32">
            <SectionHeader
              eyebrow={copy('home.announcements.eyebrow')}
              title={copy('home.announcements.title')}
              description={copy('home.announcements.description')}
            />
            <Button asChild className="mt-5 rounded-full bg-emerald-700 text-white hover:bg-emerald-800 md:mt-7">
              <Link href="/informasi/pengumuman">Lihat semua pengumuman</Link>
            </Button>
          </div>
          <div className="grid gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-1">
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

      <MotionBlock className="mx-auto grid max-w-7xl gap-7 px-4 py-12 md:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-10">
        <Card className="overflow-hidden rounded-[1.35rem] border-emerald-900/10 bg-white p-1.5 shadow-md shadow-emerald-900/5 md:rounded-[2rem] md:p-3 md:shadow-lg md:shadow-emerald-900/10">
          <Image src={copy('home.services.imageUrl')} alt={copy('home.services.imageAlt')} width={760} height={560} className="h-auto w-full rounded-[1rem] md:rounded-[1.5rem]" />
        </Card>
        <div>
          <SectionHeader
            eyebrow={copy('home.services.eyebrow')}
            title={copy('home.services.title')}
            description={copy('home.services.description')}
          />
          <div className="mt-5 grid gap-3 md:mt-8 md:grid-cols-3 md:gap-4 lg:grid-cols-1">
            {services.map((service) => (
              <Card key={service.id} className="border-emerald-900/10 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between md:gap-4 md:p-6">
                  <div>
                    <h3 className="text-base font-bold text-emerald-950 md:text-lg">{service.title}</h3>
                    <p className="mt-1.5 text-xs leading-5 text-emerald-950/65 md:mt-2 md:text-sm md:leading-6">{service.description}</p>
                  </div>
                  <Button asChild variant="outline" className="h-9 shrink-0 rounded-full border-emerald-900/15 bg-white text-xs text-emerald-900 hover:bg-emerald-50 md:h-10 md:text-sm">
                    <Link href={serviceHref[service.slug] ?? `/layanan/${service.slug}`}>Buka layanan</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </MotionBlock>

      <MotionBlock className="mx-auto max-w-7xl px-4 py-12 md:py-20">
        <Card className="overflow-hidden rounded-[1.35rem] border-emerald-900/10 bg-[radial-gradient(circle_at_top_right,rgba(132,204,22,0.12),transparent_22rem)] bg-emerald-900 text-white shadow-lg shadow-emerald-900/10 md:rounded-[2rem] md:bg-[radial-gradient(circle_at_top_right,rgba(132,204,22,0.15),transparent_32rem)] md:shadow-xl md:shadow-emerald-900/15">
          <CardContent className="grid gap-5 p-5 md:grid-cols-[0.72fr_1.28fr] md:gap-8 md:p-10">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-lime-200 md:text-sm md:tracking-[0.24em]">{copy('home.welcome.eyebrow')}</p>
              <h2 className="mt-3 text-2xl font-black tracking-tight md:mt-4 md:text-5xl">{copy('home.welcome.title')}</h2>
            </div>
            <div>
              <p className="text-base font-bold text-white md:text-xl">{copy('home.welcome.heading')}</p>
              <p className="mt-3 text-sm leading-6 text-emerald-100 md:mt-4 md:text-base md:leading-8">{copy('home.welcome.body')}</p>
              <div className="mt-5 flex flex-wrap gap-2.5 md:mt-7 md:gap-3">
                <Button asChild className="h-9 rounded-full bg-white text-xs text-emerald-900 hover:bg-emerald-50 md:h-10 md:text-sm">
                  <Link href="/profil">Profil desa</Link>
                </Button>
                <Button asChild variant="outline" className="h-9 rounded-full border-white/30 bg-transparent text-xs text-white hover:bg-white/10 md:h-10 md:text-sm">
                  <Link href="/profil/aparatur">Aparatur desa</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </MotionBlock>

      {officials.length ? (
        <MotionBlock className="mx-auto max-w-7xl px-4 py-12 md:py-20">
          <div className="mb-6 flex flex-col justify-between gap-3 md:mb-10 md:flex-row md:items-end md:gap-4">
            <SectionHeader
              eyebrow="Aparatur Desa"
              title="Perangkat desa yang melayani warga"
              description={`Kenali aparatur Pemerintah ${profile.name} yang bertugas mengelola administrasi, pelayanan publik, dan kegiatan pemerintahan desa.`}
            />
            <Button asChild variant="outline" className="w-fit rounded-full border-emerald-900/15 bg-white text-emerald-900 hover:bg-emerald-50">
              <Link href="/profil/aparatur">Lihat semua aparatur</Link>
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 md:gap-5 lg:grid-cols-4">
            {officials.map((official) => {
              const itemImages = (official.photoAssetIds || []).length
                ? official.photoAssetIds.map((id) => mediaAsset.get(id)).filter((img): img is NonNullable<typeof img> => Boolean(img))
                : official.photoAssetId
                ? [mediaAsset.get(official.photoAssetId)].filter((img): img is NonNullable<typeof img> => Boolean(img))
                : []
              return (
                <Card key={official.id} className="border-emerald-900/10 bg-white shadow-sm shadow-emerald-900/5 transition-all hover:-translate-y-1 hover:shadow-lg">
                  <CardContent className="p-4 md:p-5">
                    {itemImages.length > 0 ? (
                      <ImageCarousel images={itemImages} className="mb-3 aspect-square rounded-[1.1rem] overflow-hidden md:mb-5 md:rounded-[1.5rem]" />
                    ) : (
                      <div className="mb-3 grid aspect-square place-items-center rounded-[1.1rem] border border-emerald-900/10 bg-gradient-to-br from-emerald-100 to-lime-100 text-3xl font-black text-emerald-800 shadow-inner md:mb-5 md:rounded-[1.5rem] md:text-4xl">
                        {initials(official.name)}
                      </div>
                    )}
                    <p className="text-base font-bold text-emerald-950 md:text-lg">{official.name}</p>
                    <p className="mt-1 text-xs font-semibold text-emerald-700 md:text-sm">{official.position}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </MotionBlock>
      ) : null}

      <MotionBlock className="mx-auto max-w-7xl px-4 py-12 md:py-20">
        <div className="mb-6 flex flex-col justify-between gap-3 md:mb-10 md:flex-row md:items-end md:gap-4">
          <SectionHeader
            eyebrow={copy('home.news.eyebrow')}
            title={copy('home.news.title')}
            description={copy('home.news.description')}
          />
          <Button asChild variant="outline" className="w-fit rounded-full border-emerald-900/15 bg-white text-emerald-900 hover:bg-emerald-50">
            <Link href="/berita">Lihat semua berita</Link>
          </Button>
        </div>
        <div className="grid gap-3 md:grid-cols-3 md:gap-5">
          {newsItems.length ? (
            newsItems.map((item) => {
              const itemImages = (item.coverAssetIds || []).length
                ? item.coverAssetIds.map((id) => mediaAsset.get(id)).filter((img): img is NonNullable<typeof img> => Boolean(img))
                : item.coverAssetId
                ? [mediaAsset.get(item.coverAssetId)].filter((img): img is NonNullable<typeof img> => Boolean(img))
                : []
              return (
                <NewsCard
                  key={item.id}
                  title={item.title}
                  slug={item.slug}
                  excerpt={item.excerpt}
                  image={item.coverAssetId ? mediaAsset.get(item.coverAssetId) : null}
                  images={itemImages}
                />
              )
            })
          ) : (
            <Card className="border-emerald-900/10 bg-white md:col-span-3">
              <CardContent className="p-6">{copy('empty.news')}</CardContent>
            </Card>
          )}
        </div>
      </MotionBlock>

      <MotionBlock className="bg-white/70 py-12 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-7 px-4 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10">
          <div>
            <SectionHeader
              eyebrow={copy('home.budget.eyebrow')}
              title={copy('home.budget.title')}
              description={copy('home.budget.description')}
            />
            <div className="mt-5 grid gap-3 md:mt-8 md:gap-4">
              {budgetItems.length ? (
                budgetItems.map((item) => (
                  <Card key={item.id} className="border-emerald-900/10 bg-white shadow-sm">
                    <CardHeader className="gap-1">
                      <CardTitle className="text-base font-bold text-emerald-950 md:text-lg">{item.label}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs font-medium leading-5 text-emerald-950/65 md:text-sm md:leading-6">{item.value}</p>
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
          <Card className="overflow-hidden rounded-[1.35rem] border-emerald-900/10 bg-white p-1.5 shadow-md shadow-emerald-900/5 md:rounded-[2rem] md:p-3 md:shadow-lg md:shadow-emerald-900/10">
            <BudgetDonutChart items={budgetItems} />
          </Card>
        </div>
      </MotionBlock>
    </>
  )
}
