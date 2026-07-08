import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function EmptyState({ message, className }: { message: string; className?: string }) {
  return (
    <Card className={cn('rounded-[1.35rem] border-emerald-900/10 bg-white/95 shadow-sm shadow-emerald-900/5 backdrop-blur-sm md:rounded-3xl', className)}>
      <CardContent className="flex min-h-36 flex-col items-center justify-center p-5 text-center md:min-h-48 md:p-8">
        <div className="mb-3 flex size-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800/60 ring-4 ring-emerald-500/5 select-none md:mb-4 md:size-12 md:ring-8">
          <svg className="size-5 md:size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
        </div>
        <p className="max-w-md text-xs font-semibold leading-5 text-emerald-950/70 md:text-sm md:leading-6">{message}</p>
      </CardContent>
    </Card>
  )
}
