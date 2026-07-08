import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { PageHero } from '@/components/public/PageHero'
import { Card, CardContent } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const service = await prisma.service.findUnique({ where: { slug } })

  if (!service || service.status !== 'PUBLISHED') return {}

  return {
    title: `${service.title} - Layanan Desa Cilalawi`,
    description: service.description,
    openGraph: {
      title: service.title,
      description: service.description,
    },
  }
}

export default async function DetailLayananPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const service = await prisma.service.findUnique({ where: { slug } })

  if (!service || service.status !== 'PUBLISHED') notFound()

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 md:py-14">
      <PageHero eyebrow="Layanan" title={service.title} description={service.description} />
      <Card className="mt-5 border-emerald-900/10 bg-white shadow-sm shadow-emerald-900/5 md:mt-8">
        <CardContent className="p-4 md:p-7">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700 md:text-xs md:tracking-[0.2em]">Ketentuan Layanan</p>
          <div className="mt-3 whitespace-pre-line text-sm leading-7 text-emerald-950/75 md:mt-4 md:text-base md:leading-8">
            {service.requirements || 'Informasi persyaratan layanan akan ditampilkan setelah dilengkapi oleh admin desa.'}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
