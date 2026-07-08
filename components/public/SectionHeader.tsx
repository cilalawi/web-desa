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
      <p className="inline-flex rounded-full border border-emerald-900/10 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700 shadow-sm md:px-3 md:text-xs md:tracking-[0.22em]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-emerald-950 text-balance md:mt-4 md:text-5xl">{title}</h2>
      {description ? <p className={cn('mt-3 max-w-2xl text-sm leading-6 text-emerald-900/70 md:mt-4 md:text-base md:leading-7', align === 'center' && 'mx-auto')}>{description}</p> : null}
    </div>
  )
}
