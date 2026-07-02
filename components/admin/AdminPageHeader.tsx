import { Card, CardContent } from '@/components/ui/card'

export function AdminPageHeader({ title, description }: { title: string; description: string }) {
  return (
  <Card className="mb-6">
      <CardContent>
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
