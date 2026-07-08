import { cn } from '@/lib/utils'

export function PageHero({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow: string
  title: string
  description?: string
  className?: string
}) {
  return (
    <div className={cn('relative overflow-hidden rounded-[1.35rem] border border-emerald-900/10 bg-white/80 p-4 shadow-sm shadow-emerald-900/5 md:rounded-[2rem] md:p-8', className)}>
      <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(132,204,22,0.16),transparent_18rem)] md:bg-[radial-gradient(circle_at_top_right,rgba(132,204,22,0.2),transparent_22rem)]" />
      <div className="relative max-w-3xl">
        <p className="inline-flex rounded-full border border-emerald-900/10 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700 md:px-3 md:text-xs md:tracking-[0.22em]">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-emerald-950 text-balance md:mt-4 md:text-6xl">{title}</h1>
        {description ? <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-950/70 md:mt-4 md:text-base md:leading-7">{description}</p> : null}
      </div>
    </div>
  )
}
