import { AdminHeader } from '@/components/admin/AdminHeader'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { requireAdmin } from '@/lib/admin-auth'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()

  return (
    <div className="grid min-h-screen md:grid-cols-[240px_1fr]">
      <AdminSidebar />
      <div className="min-w-0">
        <AdminHeader />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
