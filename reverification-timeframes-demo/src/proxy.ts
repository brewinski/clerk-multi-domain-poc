import { clerkMiddleware } from '@clerk/nextjs/server'

// Nothing reverification-specific here — the app just needs a Clerk session.
// The timeframe check itself lives in the server action.
// (Next.js 16 renamed the `middleware` file convention to `proxy`.)
export default clerkMiddleware()

export const config = {
  matcher: ['/((?!_next|[^?]*\\.(?:ico|png|svg|woff2?)).*)', '/(api|trpc)(.*)'],
}
