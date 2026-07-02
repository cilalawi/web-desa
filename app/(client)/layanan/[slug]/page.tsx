import { notFound } from 'next/navigation'
import { PageHero } from '@/components/public/PageHero'
import { Card, CardContent } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'

export default async function DetailLayananPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const service = await prisma.service.findUnique({ where: { slug } })

  if (!service || service.status !== 'PUBLISHED') notFound()

  return (
    <section className="mx-auto max-w-5xl px-4 py-14">
      <PageHero eyebrow="Layanan" title={service.title} description={service.description} />
      <Card className="mt-8 border-emerald-900/10 bg-white shadow-sm shadow-emerald-900/5">
        <CardContent className="p-7">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Ketentuan Layanan</p>
          <div className="mt-4 whitespace-pre-line text-base leading-8 text-emerald-950/75">
            {service.requirements || 'Informasi persyaratan layanan akan ditampilkan setelah dilengkapi oleh admin desa.'}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
