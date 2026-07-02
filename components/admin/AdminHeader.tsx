import { UserButton } from '@clerk/nextjs'

export function AdminHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-b px-6">
      <div>
        <p className="text-sm text-muted-foreground">Panel pengelolaan website desa</p>
        <h1 className="font-semibold">Admin</h1>
      </div>
      <UserButton />
    </header>
  )
}
