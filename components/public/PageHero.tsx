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
    <div className={cn('relative overflow-hidden rounded-[2rem] border border-emerald-900/10 bg-white/80 p-6 shadow-sm shadow-emerald-900/5 md:p-8', className)}>
      <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(132,204,22,0.2),transparent_22rem)]" />
      <div className="relative max-w-3xl">
        <p className="inline-flex rounded-full border border-emerald-900/10 bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-emerald-700">
          {eyebrow}
        </p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-emerald-950 text-balance md:text-6xl">{title}</h1>
        {description ? <p className="mt-4 max-w-2xl text-base leading-7 text-emerald-950/70">{description}</p> : null}
      </div>
    </div>
  )
}
