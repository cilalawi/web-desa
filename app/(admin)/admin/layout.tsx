import { AdminHeader } from '@/components/admin/AdminHeader'
import { AdminMobileNav, AdminSidebar } from '@/components/admin/AdminSidebar'
import { requireAdmin } from '@/lib/admin-auth'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()

  return (
    <div className="grid min-h-screen bg-[linear-gradient(180deg,rgba(236,253,245,0.55),rgba(255,251,235,0.75))] md:grid-cols-[280px_1fr]">
      <AdminSidebar />
      <div className="min-w-0">
        <AdminMobileNav />
        <AdminHeader />
        <main className="min-w-0 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
