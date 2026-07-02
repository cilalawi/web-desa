import { cn } from '@/lib/utils'

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
}: {
  eyebrow: string
  title: string
  description?: string
  align?: 'left' | 'center'
}) {
  return (
    <div className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center')}>
      <p className="inline-flex rounded-full border border-emerald-900/10 bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-emerald-700 shadow-sm">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-emerald-950 text-balance md:text-5xl">{title}</h2>
      {description ? <p className={cn('mt-4 max-w-2xl text-base leading-7 text-emerald-900/70', align === 'center' && 'mx-auto')}>{description}</p> : null}
    </div>
  )
}
