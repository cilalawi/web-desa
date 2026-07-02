import Link from 'next/link'
import { adminRoutes } from '@/lib/routes'

export function AdminSidebar() {
  return (
    <aside className="min-h-screen border-r bg-white px-4 py-6">
      <Link href="/admin" className="block font-semibold tracking-tight">
        Admin Desa
      </Link>
      <nav className="mt-8 grid gap-1 text-sm">
        {adminRoutes.map((route) => (
          <Link key={route.href} href={route.href} className="rounded-lg px-3 py-2 hover:bg-neutral-100">
            {route.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
