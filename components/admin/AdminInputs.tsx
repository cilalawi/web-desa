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

export function FileField({ name, label, accept = 'image/*' }: { name: string; label: string; accept?: string }) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type="file" accept={accept} />
      <p className="text-xs text-muted-foreground">Opsional. Format JPG, PNG, WebP, atau AVIF. Maksimal 5 MB.</p>
    </div>
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
