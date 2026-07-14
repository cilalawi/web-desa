import { EmptyState } from '@/components/public/EmptyState'
import { PageHero } from '@/components/public/PageHero'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'
import { getSiteSettings, settingValue } from '@/lib/site-settings'

const parseNumber = (valStr: string) => {
  const clean = valStr.replace(/[^0-9]/g, '')
  const parsed = parseInt(clean, 10)
  return isNaN(parsed) ? 0 : parsed
}

export default async function StatistikPage() {
  const [statistics, settings] = await Promise.all([
    prisma.statistic.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { order: 'asc' },
    }),
    getSiteSettings(['empty.statistics']),
  ])

  if (!statistics.length) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <PageHero eyebrow="Informasi" title="Data Statistik" description="Ringkasan data penduduk, wilayah, dan potensi Desa Cilalawi." />
        <EmptyState className="mt-5" message={settingValue(settings, 'empty.statistics')} />
      </section>
    )
  }

  // Group by category
  const generalStats = statistics.filter((s) => s.category === 'Umum')
  const batasWilayahList = statistics.filter((s) => s.category === 'Batas Wilayah')
  const agamaList = statistics.filter((s) => s.category === 'Agama')
  const usiaList = statistics.filter((s) => s.category === 'Kelompok Usia')

  // Infrastructure
  const saranaPendidikan = statistics.filter((s) => s.category === 'Pendidikan')
  const saranaKesehatan = statistics.filter((s) => s.category === 'Kesehatan')
  const saranaKeagamaan = statistics.filter((s) => s.category === 'Keagamaan')

  // Check if we have gender data
  const lakiLaki = statistics.find((s) => s.label.toLowerCase().includes('laki-laki') || s.label.toLowerCase().includes('pria'))
  const perempuan = statistics.find((s) => s.label.toLowerCase().includes('perempuan') || s.label.toLowerCase().includes('wanita'))
  const showGenderRatio = !!lakiLaki && !!perempuan

  const maleVal = lakiLaki ? parseNumber(lakiLaki.value) : 0
  const femaleVal = perempuan ? parseNumber(perempuan.value) : 0
  const totalGenderVal = maleVal + femaleVal || 1
  const malePercent = (maleVal / totalGenderVal) * 100
  const femalePercent = (femaleVal / totalGenderVal) * 100

  // Compass directions
  const batasUtara = batasWilayahList.find((s) => s.label.toLowerCase().includes('utara'))
  const batasSelatan = batasWilayahList.find((s) => s.label.toLowerCase().includes('selatan'))
  const batasBarat = batasWilayahList.find((s) => s.label.toLowerCase().includes('barat'))
  const batasTimur = batasWilayahList.find((s) => s.label.toLowerCase().includes('timur'))
  const showCompass = !!batasUtara || !!batasSelatan || !!batasBarat || !!batasTimur

  // Age group max val for bar charting
  const ageVals = usiaList.map((s) => parseNumber(s.value))
  const maxAgeVal = Math.max(...ageVals, 1)

  // Religion total
  const totalReligionVal = agamaList.reduce((acc, s) => acc + parseNumber(s.value), 0)

  // Custom/Other categories
  const recognizedCategories = ['Umum', 'Batas Wilayah', 'Agama', 'Kelompok Usia', 'Pendidikan', 'Kesehatan', 'Keagamaan']
  const otherCategories = Array.from(new Set(statistics.map((s) => s.category || 'Umum'))).filter(
    (c) => !recognizedCategories.includes(c)
  )

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 md:py-14 space-y-6 md:space-y-10">
      <PageHero eyebrow="Informasi" title="Data Statistik" description="Ringkasan data penduduk, wilayah, dan potensi Desa Cilalawi." />

      {/* Row 1: Informasi Umum & Batas Wilayah */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Umum Cards */}
        <div className="grid gap-4 md:col-span-2 sm:grid-cols-3">
          {generalStats.slice(0, 3).map((stat) => (
            <Card key={stat.id} className="border-emerald-900/10 bg-white/70 shadow-sm backdrop-blur">
              <CardContent className="pt-6">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">{stat.label}</p>
                <p className="mt-2 text-2xl font-black text-emerald-950">{stat.value}</p>
                {stat.note ? <p className="mt-1 text-[10px] text-emerald-950/60">{stat.note}</p> : null}
              </CardContent>
            </Card>
          ))}

          {/* Render remaining general stats if any */}
          {generalStats.slice(3).map((stat) => (
            <Card key={stat.id} className="border-emerald-900/10 bg-white/70 shadow-sm backdrop-blur">
              <CardContent className="pt-6">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">{stat.label}</p>
                <p className="mt-2 text-2xl font-black text-emerald-950">{stat.value}</p>
                {stat.note ? <p className="mt-1 text-[10px] text-emerald-950/60">{stat.note}</p> : null}
              </CardContent>
            </Card>
          ))}

          {/* Gender Ratio Card */}
          {showGenderRatio ? (
            <Card className="border-emerald-900/10 bg-white/70 shadow-sm backdrop-blur sm:col-span-3">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-black text-emerald-950 uppercase tracking-[0.12em]">Rasio Jenis Kelamin</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex h-6 w-full overflow-hidden rounded-full bg-slate-100 text-[10px] font-bold text-white shadow-inner">
                  <div
                    className="flex items-center justify-center bg-gradient-to-r from-emerald-600 to-emerald-500 transition-all duration-500"
                    style={{ width: `${malePercent}%` }}
                  >
                    {malePercent > 15 ? `Laki-laki (${Math.round(malePercent)}%)` : ''}
                  </div>
                  <div
                    className="flex items-center justify-center bg-gradient-to-r from-lime-500 to-lime-400 transition-all duration-500"
                    style={{ width: `${femalePercent}%` }}
                  >
                    {femalePercent > 15 ? `Perempuan (${Math.round(femalePercent)}%)` : ''}
                  </div>
                </div>
                <div className="flex justify-between text-xs font-extrabold text-emerald-950/80">
                  <div className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-full bg-emerald-600" />
                    <span>Laki-laki: {lakiLaki.value}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-full bg-lime-500" />
                    <span>Perempuan: {perempuan.value}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>

        {/* Batas Wilayah Card */}
        {showCompass ? (
          <Card className="border-emerald-900/10 bg-white/70 shadow-sm backdrop-blur flex flex-col justify-between">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-black text-emerald-950 uppercase tracking-[0.12em]">Batas Wilayah</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center py-6">
              <div className="relative w-full max-w-[240px] aspect-square flex items-center justify-center border border-dashed border-emerald-900/20 rounded-full p-4 bg-emerald-50/20">
                <div className="absolute top-1 text-center">
                  <span className="text-[9px] font-black uppercase text-emerald-800 tracking-wider block">Utara</span>
                  <p className="text-xs font-bold text-emerald-950 truncate max-w-[100px]">{batasUtara?.value || '-'}</p>
                </div>
                <div className="absolute bottom-1 text-center flex flex-col items-center">
                  <p className="text-xs font-bold text-emerald-950 truncate max-w-[100px]">{batasSelatan?.value || '-'}</p>
                  <span className="text-[9px] font-black uppercase text-emerald-800 tracking-wider block leading-none">Selatan</span>
                </div>
                <div className="absolute left-1 text-center">
                  <span className="text-[9px] font-black uppercase text-emerald-800 tracking-wider block">Barat</span>
                  <p className="text-xs font-bold text-emerald-950 truncate max-w-[80px]">{batasBarat?.value || '-'}</p>
                </div>
                <div className="absolute right-1 text-center">
                  <span className="text-[9px] font-black uppercase text-emerald-800 tracking-wider block">Timur</span>
                  <p className="text-xs font-bold text-emerald-950 truncate max-w-[80px]">{batasTimur?.value || '-'}</p>
                </div>
                <div className="flex flex-col items-center justify-center size-16 bg-white rounded-full border border-emerald-900/10 shadow-sm select-none">
                  <span className="text-[10px] font-black text-emerald-800 leading-none">DESA</span>
                  <span className="text-[9px] font-extrabold text-emerald-950/50 mt-0.5">CILALAWI</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          batasWilayahList.length ? (
            <Card className="border-emerald-900/10 bg-white/70 shadow-sm backdrop-blur">
              <CardHeader>
                <CardTitle className="text-sm font-black text-emerald-950 uppercase tracking-[0.12em]">Batas Wilayah</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {batasWilayahList.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm py-1 border-b border-emerald-900/5">
                    <span className="font-bold text-emerald-950/70">{item.label}</span>
                    <span className="font-black text-emerald-950">{item.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : null
        )}
      </div>

      {/* Row 2: Agama & Kelompok Usia */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Agama Card */}
        {agamaList.length ? (
          <Card className="border-emerald-900/10 bg-white/70 shadow-sm backdrop-blur h-fit">
            <CardHeader>
              <CardTitle className="text-lg font-black text-emerald-950">Penduduk Berdasarkan Agama</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {agamaList.map((item) => {
                const val = parseNumber(item.value)
                const percent = totalReligionVal > 0 ? (val / totalReligionVal) * 100 : 0
                return (
                  <div key={item.id} className="space-y-1">
                    <div className="flex justify-between text-xs font-extrabold text-emerald-950">
                      <span>{item.label.replace('Agama ', '')}</span>
                      <span className="font-black">
                        {item.value} {percent > 0 ? `(${Math.round(percent)}%)` : ''}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        ) : null}

        {/* Kelompok Usia Card */}
        {usiaList.length ? (
          <Card className="border-emerald-900/10 bg-white/70 shadow-sm backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg font-black text-emerald-950">Kelompok Usia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {usiaList.map((item) => {
                const val = parseNumber(item.value)
                const percent = (val / maxAgeVal) * 100
                return (
                  <div key={item.id} className="grid grid-cols-[80px_1fr_70px] items-center gap-3">
                    <span className="text-[11px] font-extrabold text-emerald-950/70">{item.label.replace('Usia ', '')}</span>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-black text-emerald-950 text-right">{item.value}</span>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        ) : null}
      </div>

      {/* Row 3: Sarana & Prasarana */}
      {saranaPendidikan.length || saranaKesehatan.length || saranaKeagamaan.length ? (
        <Card className="border-emerald-900/10 bg-white/70 shadow-sm backdrop-blur">
          <CardHeader>
            <CardTitle className="text-lg font-black text-emerald-950">Sarana & Prasarana Desa</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-3">
            {/* Pendidikan */}
            {saranaPendidikan.length ? (
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-[0.16em] text-emerald-800 border-b border-emerald-900/10 pb-1">
                  Pendidikan
                </h3>
                <div className="divide-y divide-emerald-900/5">
                  {saranaPendidikan.map((item) => (
                    <div key={item.id} className="flex justify-between py-2 text-xs">
                      <span className="font-bold text-emerald-950/70">{item.label.replace('Pendidikan ', '')}</span>
                      <span className="font-black text-emerald-950">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Kesehatan */}
            {saranaKesehatan.length ? (
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-[0.16em] text-emerald-800 border-b border-emerald-900/10 pb-1">
                  Kesehatan
                </h3>
                <div className="divide-y divide-emerald-900/5">
                  {saranaKesehatan.map((item) => (
                    <div key={item.id} className="flex justify-between py-2 text-xs">
                      <span className="font-bold text-emerald-950/70">{item.label.replace('Kesehatan ', '')}</span>
                      <span className="font-black text-emerald-950">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Keagamaan */}
            {saranaKeagamaan.length ? (
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-[0.16em] text-emerald-800 border-b border-emerald-900/10 pb-1">
                  Keagamaan
                </h3>
                <div className="divide-y divide-emerald-900/5">
                  {saranaKeagamaan.map((item) => (
                    <div key={item.id} className="flex justify-between py-2 text-xs">
                      <span className="font-bold text-emerald-950/70">{item.label.replace('Keagamaan ', '')}</span>
                      <span className="font-black text-emerald-950">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      {/* Row 4: Custom / Other categories */}
      {otherCategories.map((category) => {
        const categoryStats = statistics.filter((s) => s.category === category)
        return (
          <Card key={category} className="border-emerald-900/10 bg-white/70 shadow-sm backdrop-blur">
            <CardHeader>
              <CardTitle className="text-lg font-black text-emerald-950">{category}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-4">
              {categoryStats.map((item) => (
                <div key={item.id} className="p-4 rounded-xl border border-emerald-900/5 bg-white/50">
                  <p className="text-[10px] font-black uppercase tracking-wider text-emerald-700">{item.label}</p>
                  <p className="mt-1 text-xl font-black text-emerald-950">{item.value}</p>
                  {item.note ? <p className="mt-1 text-[9px] text-emerald-950/65">{item.note}</p> : null}
                </div>
              ))}
            </CardContent>
          </Card>
        )
      })}
    </section>
  )
}
