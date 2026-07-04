import { AdminForm } from '@/components/admin/AdminForm'
import { TextAreaField, TextField } from '@/components/admin/AdminInputs'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { SaveNotice } from '@/components/admin/SaveNotice'
import { Card, CardContent } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'
import { updateProfile } from '../actions'

export default async function AdminProfilPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>
}) {
  const notice = await searchParams
  const profile = await prisma.villageProfile.findFirst({ where: { name: 'Desa Cilalawi' } })

  return (
    <section>
      <AdminPageHeader title="Kelola Profil Desa" description="Kelola profil umum, kontak, alamat, dan peta desa." />
      {notice.saved ? <SaveNotice type="saved" /> : null}
      <Card>
        <CardContent>
          <AdminForm action={updateProfile}>
            <TextField name="tagline" label="Tagline" defaultValue={profile?.tagline ?? 'Website resmi Desa Cilalawi'} />
            <TextAreaField name="description" label="Deskripsi" defaultValue={profile?.description ?? 'Pusat informasi, layanan warga, pengumuman, dan transparansi publik Desa Cilalawi.'} />
            <TextAreaField name="address" label="Alamat" defaultValue={profile?.address} required={false} />
            <TextField name="phone" label="Telepon" defaultValue={profile?.phone} required={false} />
            <TextField name="email" label="Email" type="email" defaultValue={profile?.email} required={false} />
            <TextAreaField name="mapUrl" label="Google Maps Embed URL" defaultValue={profile?.mapUrl} required={false} />
          </AdminForm>
        </CardContent>
      </Card>
    </section>
  )
}
