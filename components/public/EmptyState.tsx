import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function EmptyState({ message, className }: { message: string; className?: string }) {
  return (
    <Card className={cn('border-emerald-900/10 bg-white shadow-sm shadow-emerald-900/5', className)}>
      <CardContent className="flex min-h-36 items-center justify-center p-6 text-center">
        <p className="max-w-lg text-sm leading-6 text-emerald-950/65">{message}</p>
      </CardContent>
    </Card>
  )
}
