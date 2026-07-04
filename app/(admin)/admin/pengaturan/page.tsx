import { AdminForm } from '@/components/admin/AdminForm'
import { TextAreaField, TextField } from '@/components/admin/AdminInputs'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { SaveNotice } from '@/components/admin/SaveNotice'
import { Card, CardContent } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'
import { SITE_SETTING_GROUPS, SITE_SETTING_KEYS } from '@/lib/site-settings'
import { updateSetting } from '../actions'

export default async function AdminPengaturanPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>
}) {
  const notice = await searchParams
  const rows = await prisma.siteSetting.findMany({ where: { key: { in: SITE_SETTING_KEYS } } })
  const byKey = new Map(rows.map((r) => [r.key, r]))

  return (
    <section>
      <AdminPageHeader title="Pengaturan Desa" description="Kelola teks halaman publik, fallback konten, visi, misi, dan sejarah desa." />
      {notice.saved ? <SaveNotice type="saved" /> : null}
      <div className="grid gap-6">
        {SITE_SETTING_GROUPS.map((group) => (
          <Card key={group.title}>
            <CardContent>
              <h3 className="font-semibold">{group.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{group.description}</p>
              <div className="mt-5 grid gap-4">
                {group.settings.map((setting) => (
                  <AdminForm key={setting.key} action={updateSetting}>
                    <input type="hidden" name="key" value={setting.key} />
                    <input type="hidden" name="description" value={setting.description} />
                    {setting.field === 'textarea' ? (
                      <TextAreaField name="value" label={setting.title} defaultValue={byKey.get(setting.key)?.value ?? setting.defaultValue} />
                    ) : (
                      <TextField name="value" label={setting.title} type={setting.field === 'url' ? 'text' : 'text'} defaultValue={byKey.get(setting.key)?.value ?? setting.defaultValue} />
                    )}
                  </AdminForm>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
