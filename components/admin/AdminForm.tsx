import { Button } from '@/components/ui/button'

export function AdminForm({
  action,
  children,
  submitLabel = 'Simpan',
}: {
  action: (formData: FormData) => Promise<void>
  children: React.ReactNode
  submitLabel?: string
}) {
  return (
    <form action={action} className="grid gap-4">
      {children}
      <div className="flex justify-end gap-2">
        <Button type="submit" className="rounded-full px-6">{submitLabel}</Button>
      </div>
    </form>
  )
}
