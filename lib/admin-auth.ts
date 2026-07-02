import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { ADMIN_ROLE } from '@/lib/admin-role'

export async function requireAdmin() {
  const user = await currentUser()

  if (!user) redirect('/sign-in')
  if (user.publicMetadata?.role !== ADMIN_ROLE) redirect('/')

  return user
}
