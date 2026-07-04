export function SaveNotice({ type = 'saved', message }: { type?: 'saved' | 'deleted'; message?: string }) {
  const text = message ?? (type === 'deleted' ? 'Data berhasil dihapus.' : 'Data berhasil disimpan.')

  return (
    <div className="my-4 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 shadow-sm">
      <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white" aria-hidden="true">
        ✓
      </span>
      <div>
        <p className="font-semibold">Berhasil</p>
        <p className="text-emerald-800">{text}</p>
      </div>
    </div>
  )
}
