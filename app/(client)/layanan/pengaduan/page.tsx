import type { Metadata } from 'next'
import { PageHero } from '@/components/public/PageHero'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createComplaint } from './actions'

export const metadata: Metadata = {
  title: 'Pengaduan Kependudukan Desa Cilalawi - Portal Resmi',
  description: 'Sampaikan laporan, aduan, saran, dan aspirasi kependudukan Anda secara langsung kepada Pemerintah Desa Cilalawi.',
}

const fields = [
  { id: 'nik', label: 'NIK', type: 'text', placeholder: 'Masukkan NIK', required: true },
  { id: 'nama', label: 'Nama', type: 'text', placeholder: 'Masukkan nama lengkap', required: true },
  { id: 'email', label: 'Email', type: 'email', placeholder: 'Masukkan alamat email', required: false },
  { id: 'telepon', label: 'No. Telp', type: 'tel', placeholder: 'Masukkan nomor telepon', required: true },
] as const

export default async function PengaduanPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const params = await searchParams
  const isSent = params.status === 'terkirim'

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <PageHero
        eyebrow="Layanan"
        title="Form Pengaduan Warga"
        description="Sampaikan laporan awal kepada Pemerintah Desa Cilalawi. Data pengaduan tersimpan untuk ditinjau admin desa."
      />
      <div className="mt-5 grid gap-4 md:mt-8 md:gap-6 lg:grid-cols-[0.75fr_1.25fr]">
        <Card className="h-fit border-emerald-900/10 bg-emerald-900 text-white shadow-lg shadow-emerald-900/15">
          <CardContent className="p-4 md:p-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-lime-200 md:text-xs md:tracking-[0.2em]">Alur Pengaduan</p>
            <ol className="mt-3 space-y-2.5 text-xs leading-5 text-emerald-50/85 md:mt-5 md:space-y-4 md:text-sm md:leading-6">
              <li>1. Isi identitas dan uraian pengaduan dengan jelas.</li>
              <li>2. Laporan masuk ke panel pengelolaan desa.</li>
              <li>3. Admin desa meninjau dan menindaklanjuti laporan.</li>
            </ol>
          </CardContent>
        </Card>
        <div>
          {isSent ? (
            <Card className="mb-6 border-emerald-900/10 bg-lime-50 shadow-sm">
              <CardContent className="p-4 md:p-6">
                <p className="font-bold text-emerald-950">Pengaduan terkirim.</p>
                <p className="mt-1.5 text-xs text-emerald-950/65 md:mt-2 md:text-sm">Admin desa dapat meninjau laporan dari panel pengelolaan.</p>
              </CardContent>
            </Card>
          ) : null}
          <Card className="border-emerald-900/10 bg-white shadow-sm shadow-emerald-900/5">
            <CardContent className="p-4 md:p-6">
              <form action={createComplaint} className="grid gap-4 md:gap-5">
                {fields.map((field) => (
                  <div key={field.id} className="grid gap-2">
                    <Label htmlFor={field.id} className="font-semibold text-emerald-950">
                      {field.label}
                      {field.required ? <span className="text-destructive"> *</span> : null}
                    </Label>
                    <Input id={field.id} name={field.id} type={field.type} placeholder={field.placeholder} required={field.required} />
                  </div>
                ))}
                <div className="grid gap-2">
                  <Label htmlFor="isi" className="font-semibold text-emerald-950">
                    Isi Pengaduan <span className="text-destructive">*</span>
                  </Label>
                  <Textarea id="isi" name="isi" placeholder="Jelaskan pengaduan dengan singkat dan jelas" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bukti" className="font-semibold text-emerald-950">Upload Bukti Pengaduan</Label>
                  <Input id="bukti" name="bukti" type="file" disabled />
                  <p className="text-xs text-emerald-950/55">Upload bukti akan diaktifkan setelah storage Supabase/local upload disiapkan.</p>
                </div>
                <Button type="submit" className="h-11 rounded-full bg-emerald-700 px-5 text-sm font-semibold text-white hover:bg-emerald-800">
                  Kirim Pengaduan
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
