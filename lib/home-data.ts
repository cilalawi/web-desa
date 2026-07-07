import { prisma } from '@/lib/prisma'
import { SITE_SETTING_KEYS, settingsToMap } from '@/lib/site-settings'

export async function getHomeData() {
  const [profile, statistics, services, announcements, newsItems, officials, budgetItems, settings] = await Promise.all([
    prisma.villageProfile.findFirst({ where: { name: 'Desa Cilalawi' } }),
    prisma.statistic.findMany({ where: { status: 'PUBLISHED' }, orderBy: { order: 'asc' }, take: 4 }),
    prisma.service.findMany({ where: { status: 'PUBLISHED' }, orderBy: { order: 'asc' }, take: 3 }),
    prisma.announcement.findMany({ where: { status: 'PUBLISHED' }, orderBy: { publishedAt: 'desc' }, take: 3 }),
    prisma.news.findMany({ where: { status: 'PUBLISHED' }, orderBy: { publishedAt: 'desc' }, take: 3 }),
    prisma.villageOfficial.findMany({ where: { status: 'PUBLISHED' }, orderBy: { order: 'asc' }, take: 4 }),
    prisma.budgetItem.findMany({ where: { status: 'PUBLISHED' }, orderBy: [{ year: 'desc' }, { order: 'asc' }], take: 3 }),
    prisma.siteSetting.findMany({ where: { key: { in: SITE_SETTING_KEYS } } }),
  ])
  const newsCoverAssetIds = newsItems.flatMap((item) => [...(item.coverAssetIds || []), item.coverAssetId].filter((id): id is string => Boolean(id)))
  const officialPhotoAssetIds = officials.flatMap((official) => [...(official.photoAssetIds || []), official.photoAssetId].filter((id): id is string => Boolean(id)))
  const mediaAssetIds = [...newsCoverAssetIds, ...officialPhotoAssetIds]
  const mediaAssets = mediaAssetIds.length ? await prisma.mediaAsset.findMany({ where: { id: { in: mediaAssetIds } } }) : []
  const mediaAsset = new Map(mediaAssets.map((asset) => [asset.id, asset]))

  return {
    profile: profile ?? {
      name: 'Desa Cilalawi',
      tagline: '',
      description: '',
    },
    statistics,
    services,
    announcements,
    newsItems,
    officials,
    mediaAsset,
    budgetItems,
    settings: settingsToMap(settings),
  }
}
