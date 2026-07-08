import type { Metadata } from 'next'
import { PageHero } from '@/components/public/PageHero'
import { Card, CardContent } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Panduan Bantuan Penggunaan Portal - Desa Cilalawi',
  description: 'Panduan dan bantuan penggunaan portal resmi Desa Cilalawi untuk mencari informasi, layanan warga, dan pengaduan online.',
}

const tips = [
  { title: 'Cari Informasi', text: 'Gunakan menu navigasi untuk menemukan pengumuman, berita, agenda, dan data desa.' },
  { title: 'Ajukan Pengaduan', text: 'Buka halaman Layanan → Pengaduan Warga, lalu isi formulir pengaduan dengan data yang benar.' },
  { title: 'Hubungi Desa', text: 'Lihat nomor telepon, email, alamat, dan jam layanan di halaman Kontak.' },
]

export default function BantuanPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-14">
      <PageHero eyebrow="Bantuan" title="Bantuan Penggunaan Website" description="Panduan singkat untuk warga menggunakan portal resmi Desa Cilalawi." />
      <div className="mt-8 grid gap-5">
        {tips.map((tip, index) => (
          <Card key={tip.title} className="border-emerald-900/10 bg-white shadow-sm shadow-emerald-900/5">
            <CardContent className="flex gap-4 p-6">
              <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-sm font-black text-emerald-800">{index + 1}</span>
              <div>
                <p className="text-lg font-bold text-emerald-950">{tip.title}</p>
                <p className="mt-2 text-sm leading-6 text-emerald-950/65">{tip.text}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
