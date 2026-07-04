'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'

export function FormSubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="rounded-full px-6 disabled:cursor-wait">
      {pending ? (
        <span className="inline-flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
          Menyimpan data…
        </span>
      ) : (
        label
      )}
    </Button>
  )
}
