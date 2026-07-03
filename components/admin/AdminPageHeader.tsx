import { Card, CardContent } from '@/components/ui/card'

export function AdminPageHeader({ title, description }: { title: string; description: string }) {
  return (
    <Card className="mb-6 border-emerald-900/10 bg-white/90 shadow-sm shadow-emerald-900/5">
      <CardContent className="p-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Panel Pengelolaan</p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-emerald-950">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-emerald-950/65">{description}</p>
      </CardContent>
    </Card>
  )
}
