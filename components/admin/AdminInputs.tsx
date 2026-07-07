import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export function TextField({ name, label, defaultValue = '', type = 'text', required = true }: { name: string; label: string; defaultValue?: string | number | null; type?: string; required?: boolean }) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type={type} defaultValue={defaultValue ?? ''} required={required} />
    </div>
  )
}

import { ImageUploadField } from './ImageUploadField'

type DBImage = { id: string; url: string; alt: string }

export function FileField({
  name,
  label,
  accept = 'image/*',
  currentImages = [],
}: {
  name: string
  label: string
  accept?: string
  currentImages?: DBImage[]
}) {
  return (
    <>
      <div className="hidden">
        <input type="file" accept={accept} readOnly />
      </div>
      <ImageUploadField name={name} label={label} currentImages={currentImages} />
    </>
  )
}

export function TextAreaField({ name, label, defaultValue = '', required = true }: { name: string; label: string; defaultValue?: string | null; required?: boolean }) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Textarea id={name} name={name} defaultValue={defaultValue ?? ''} required={required} />
    </div>
  )
}

export function StatusField({ defaultValue = 'DRAFT' }: { defaultValue?: string }) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="status">Status</Label>
      <select id="status" name="status" defaultValue={defaultValue} className="h-10 rounded-md border bg-background px-3 text-sm">
        <option value="DRAFT">Draf</option>
        <option value="PUBLISHED">Terbit</option>
        <option value="ARCHIVED">Arsip</option>
      </select>
    </div>
  )
}
