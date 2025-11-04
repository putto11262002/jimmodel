# [Component/Feature Name]

## Overview
Brief 1-2 sentence description of what this component/feature does and why it was implemented.

Example:
> Handles user authentication and session management for the application. Allows users to sign in with GitHub OAuth and maintains secure sessions using JWT tokens.

## Files & Locations

List all key files involved in this implementation:

- **Client setup:** `app/lib/auth-client.ts`
- **Server configuration:** `app/lib/auth-server.ts`
- **Middleware:** `app/middleware.ts`
- **API routes:** `app/api/auth/[...nextauth]/route.ts`
- **Protected pages:** `app/dashboard/` (uses auth middleware)
- **Types:** `app/types/auth.ts`

## Technologies & Libraries

- **Primary Library:** [Library Name] v[X.Y.Z]
  - Documentation: [Link to docs]
  - Why: Brief explanation of why this library was chosen

- **Additional Dependencies:** [Other relevant packages]

Example:
> - **Primary Library:** next-auth v5.0.0
>   - Documentation: https://next-auth.js.org/
>   - Why: Industry-standard auth solution for Next.js with excellent OAuth support
>
> - **Related Dependencies:**
>   - jsonwebtoken: For JWT token handling
>   - bcrypt: For password hashing (if applicable)

## Configuration

### Environment Variables
List required environment variables and their purpose:

- `GITHUB_ID` - GitHub OAuth application ID
- `GITHUB_SECRET` - GitHub OAuth application secret (do not commit)
- `NEXTAUTH_SECRET` - Secret for signing tokens (generate with `openssl rand -base64 32`)

### Config Files
- `.env.local` - Stores sensitive credentials (gitignored)
- `app/lib/auth.config.ts` - Auth configuration and providers

### Setup Steps
1. Create GitHub OAuth application at https://github.com/settings/developers
2. Copy `Client ID` to `GITHUB_ID` in `.env.local`
3. Copy `Client Secret` to `GITHUB_SECRET` in `.env.local`
4. Run `openssl rand -base64 32` and add result as `NEXTAUTH_SECRET`
5. Restart development server with `pnpm dev`

## How It Works

Explain the implementation flow and how the pieces fit together:

Example:
> When a user visits a protected page, the middleware (`app/middleware.ts`) checks for an active session. If no session exists, they're redirected to `/api/auth/signin`. The auth API route uses next-auth to handle OAuth flow with GitHub. Upon successful authentication, a JWT token is generated and stored in a secure httpOnly cookie. Subsequent requests include this cookie, allowing the middleware to verify the user is authenticated.

## API Endpoints

If applicable, document the API routes:

- `GET /api/auth/signin` - Sign in page/redirect
- `GET /api/auth/callback/github` - OAuth callback from GitHub
- `POST /api/auth/signout` - Sign out user
- `GET /api/auth/session` - Get current session (client-side)

## Usage Examples

Show how to use this component in your application:

```typescript
// Check authentication in a Server Component
import { auth } from '@/lib/auth'

export default async function Dashboard() {
  const session = await auth()

  if (!session) {
    redirect('/api/auth/signin')
  }

  return <div>Welcome {session.user.name}</div>
}
```

```typescript
// Check authentication in a Client Component
'use client'
import { useSession } from 'next-auth/react'

export function ClientComponent() {
  const { data: session } = useSession()

  return session ? <p>Logged in</p> : <p>Not logged in</p>
}
```

## Related Documentation

- [Next.js Authentication Guide](https://nextjs.org/docs/app/building-your-application/authentication)
- [next-auth Documentation](https://next-auth.js.org/)
- [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)

## Future Considerations

- [ ] Add email/password authentication as alternative to OAuth
- [ ] Implement refresh token rotation for enhanced security
- [ ] Add role-based access control (RBAC)
- [ ] Set up session persistence across deployments (Redis or database)

## Notes

Any additional notes, known limitations, or important information for developers:

- GitHub OAuth only works on configured domains; localhost needs special setup
- Session data is stored in memory in development; use external session store for production
- Consider rate limiting on auth endpoints for security
