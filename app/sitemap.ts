import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const domain = 'https://cilalawi.info'

  // Fetch dynamic content from Prisma database
  const [news, services] = await Promise.all([
    prisma.news.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true },
    }),
    prisma.service.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true },
    }),
  ])

  // Static routes
  const staticRoutes = [
    '',
    '/profil',
    '/profil/sejarah',
    '/profil/visi-misi',
    '/profil/aparatur',
    '/berita',
    '/layanan',
    '/layanan/pengaduan',
    '/galeri',
    '/produk',
    '/kontak',
    '/peta',
    '/bantuan',
    '/informasi/pengumuman',
    '/informasi/agenda',
    '/informasi/statistik',
  ].map((route) => {
    let priority = 0.6
    let changeFrequency: 'daily' | 'weekly' | 'monthly' = 'weekly'

    if (route === '') {
      priority = 1.0
      changeFrequency = 'daily'
    } else if (
      route === '/berita' ||
      route === '/layanan' ||
      route === '/informasi/pengumuman'
    ) {
      priority = 0.8
      changeFrequency = 'daily'
    } else if (route.startsWith('/profil') || route.startsWith('/layanan/')) {
      priority = 0.7
      changeFrequency = 'weekly'
    }

    return {
      url: `${domain}${route}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
    }
  })

  // Dynamic news pages
  const newsRoutes = news.map((item) => ({
    url: `${domain}/berita/${item.slug}`,
    lastModified: item.updatedAt,
    changeFrequency: 'weekly' as 'weekly',
    priority: 0.7,
  }))

  // Dynamic services pages
  const serviceRoutes = services.map((item) => ({
    url: `${domain}/layanan/${item.slug}`,
    lastModified: item.updatedAt,
    changeFrequency: 'monthly' as 'monthly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...newsRoutes, ...serviceRoutes]
}
