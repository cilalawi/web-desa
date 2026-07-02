import { Card, CardContent } from '@/components/ui/card'

export function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="border-emerald-900/10 bg-white/90 shadow-sm shadow-emerald-900/5 transition-all hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className="p-5">
        <p className="text-3xl font-black tracking-tight text-emerald-800">{value}</p>
        <p className="mt-2 text-sm font-medium text-emerald-950/65">{label}</p>
      </CardContent>
    </Card>
  )
}
