import { Label } from '@/components/ui/label'
import { ImageUploadField } from './ImageUploadField'

type DBImage = { id: string; url: string; alt: string }

export function TextField({
  name,
  label,
  defaultValue = '',
  type = 'text',
  required = true,
}: {
  name: string
  label: string
  defaultValue?: string | number | null
  type?: string
  required?: boolean
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={name} className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-emerald-900/80">
        {label}
      </Label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue ?? ''}
        required={required}
        className="flex h-11 w-full rounded-xl border border-emerald-900/10 bg-white px-4 text-sm text-emerald-950 placeholder:text-emerald-950/40 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15 focus:outline-none transition-all"
      />
    </div>
  )
}

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

export function TextAreaField({
  name,
  label,
  defaultValue = '',
  required = true,
}: {
  name: string
  label: string
  defaultValue?: string | null
  required?: boolean
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={name} className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-emerald-900/80">
        {label}
      </Label>
      <textarea
        id={name}
        name={name}
        defaultValue={defaultValue ?? ''}
        required={required}
        rows={4}
        className="flex min-h-24 w-full rounded-xl border border-emerald-900/10 bg-white px-4 py-3 text-sm text-emerald-950 placeholder:text-emerald-950/40 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15 focus:outline-none transition-all resize-y"
      />
    </div>
  )
}

export function StatusField({ defaultValue = 'DRAFT' }: { defaultValue?: string }) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="status" className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-emerald-900/80">
        Status
      </Label>
      <select
        id="status"
        name="status"
        defaultValue={defaultValue}
        className="flex h-11 w-full rounded-xl border border-emerald-900/10 bg-white px-4 text-sm text-emerald-950 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15 focus:outline-none transition-all appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23064e3b%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[size:0.65rem_auto] bg-[position:right_1rem_center] bg-no-repeat pr-10"
      >
        <option value="DRAFT">Draf</option>
        <option value="PUBLISHED">Terbit</option>
        <option value="ARCHIVED">Arsip</option>
      </select>
    </div>
  )
}
