const colors: Record<string, string> = {
  DRAFT: 'border-neutral-200 bg-white text-neutral-600',
  PUBLISHED: 'border-neutral-300 bg-neutral-950 text-white',
  ARCHIVED: 'border-neutral-200 bg-neutral-100 text-neutral-700',
  NEW: 'border-neutral-300 bg-neutral-950 text-white',
  IN_REVIEW: 'border-neutral-200 bg-neutral-100 text-neutral-700',
  RESOLVED: 'border-neutral-300 bg-neutral-950 text-white',
  REJECTED: 'border-neutral-300 bg-white text-neutral-900',
}

const labels: Record<string, string> = {
  DRAFT: 'Draf',
  PUBLISHED: 'Terbit',
  ARCHIVED: 'Arsip',
  NEW: 'Baru',
  IN_REVIEW: 'Ditinjau',
  RESOLVED: 'Selesai',
  REJECTED: 'Ditolak',
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${colors[status] ?? 'border-neutral-200 bg-white text-neutral-600'}`}>
      {labels[status] ?? status}
    </span>
  )
}
