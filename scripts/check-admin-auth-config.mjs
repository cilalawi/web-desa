import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const read = (path) => readFileSync(join(root, path), 'utf8')

const role = read('lib/admin-role.ts')
assert.match(role, /ADMIN_ROLE\s*=\s*'admin'/)

const proxy = read('proxy.ts')
assert.match(proxy, /createRouteMatcher\(\['\/admin\(\.\*\)'\]\)/)
assert.match(proxy, /auth\.protect\(/)
assert.doesNotMatch(proxy, /role:\s*ADMIN_ROLE/)
assert.match(proxy, /unauthenticatedUrl:\s*new URL\('\/sign-in', req\.url\)\.toString\(\)/)
assert.doesNotMatch(proxy, /unauthenticatedUrl:\s*'\/sign-in'/)

const helper = read('lib/admin-auth.ts')
assert.match(helper, /import \{ currentUser \} from '@clerk\/nextjs\/server'/)
assert.match(helper, /publicMetadata\?\.role\s*!==\s*ADMIN_ROLE/)
assert.match(helper, /redirect\('\/'\)/)
assert.doesNotMatch(helper, /auth\.protect\(/)

const actions = read('app/(admin)/admin/actions.ts')
assert.match(actions, /import \{ requireAdmin \} from '@\/lib\/admin-auth'/)
assert.doesNotMatch(actions, /const \{ userId \} = await auth\(\)/)

const rootLayout = read('app/layout.tsx')
assert.match(rootLayout, /<ClerkProvider>/)

const adminLayout = read('app/(admin)/admin/layout.tsx')
assert.match(adminLayout, /await requireAdmin\(\)/)
assert.doesNotMatch(adminLayout, /ClerkProvider/)

const signInPage = read('app/(auth)/sign-in/[[...sign-in]]/page.tsx')
assert.match(signInPage, /<SignIn routing="path" path="\/sign-in" forceRedirectUrl="\/admin" \/>/)

const publicNavbar = read('components/public/PublicNavbar.tsx')
assert.match(publicNavbar, /href="\/admin" prefetch=\{false\}/)

console.log('admin auth wiring ok')
