import { FormSubmitButton } from '@/components/admin/FormSubmitButton'

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
        <FormSubmitButton label={submitLabel} />
      </div>
    </form>
  )
}
