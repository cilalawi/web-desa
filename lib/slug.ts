export function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'item'
}

export function buildUniqueSlug(value: string, existingSlugs: string[]) {
  const baseSlug = slugify(value)
  const taken = new Set(existingSlugs)
  if (!taken.has(baseSlug)) return baseSlug

  let suffix = 2
  while (taken.has(`${baseSlug}-${suffix}`)) suffix += 1
  return `${baseSlug}-${suffix}`
}
