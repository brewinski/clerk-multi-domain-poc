import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

function isCanstar(hostname: string) {
  return (hostname.startsWith("canstar") && !hostname.startsWith("canstarblue"))
}

function isCanstarBlue(hostname: string) {
  return hostname.startsWith("canstarblue")
}


function hostSiteMiddleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
  const hostname = req.headers
    .get("host")!
    .replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);

  const searchParams = req.nextUrl.searchParams.toString();
  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`;


  if (isCanstar(hostname)) {
    // Set domain type in request headers for server components
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-domain-type', 'canstar');

    // rewrite to canstar path
    return NextResponse.rewrite(new URL(`/canstar${path}`, req.url), {
      request: {
        headers: requestHeaders,
      },
    });
  }

  if (isCanstarBlue(hostname)) {
    // Set domain type in request headers for server components
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-domain-type', 'canstarblue');

    // rewrite to canstarblue path
    return NextResponse.rewrite(new URL(`/canstarblue${path}`, req.url), {
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Default domain
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-domain-type', 'canstar');
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Set the homepage as a public route
const isProtectedRoute = createRouteMatcher(['/user', "/credit-score/verification(.*)"])

const isMFARoute = createRouteMatcher([
  //'/credit-score/verification(.*)'
])

const skipSync = createRouteMatcher([
  "/",
  "",
])




const clerkMiddlewareInstance = clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect()
  }

  if (isMFARoute(req)) {
    const { userId, sessionClaims } = await auth();
    if (sessionClaims!.isMfa === undefined) {
      console.error('You need to add the `isMfa` claim to your session token.')
    }

    if (sessionClaims!.isMfa === false) {
      return NextResponse.redirect(new URL("/account/manage-mfa/", req.url))
    }
  }

  return hostSiteMiddleware(req)
}, {
  debug: false,
})

export default async function middleware(req: NextRequest, event: NextFetchEvent) {
  if (skipSync(req)) {
    req.cookies.set('__clerk_redirect_count', "3")
  }

  const response = clerkMiddlewareInstance(req, event) as NextResponse<any>;

  return response
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
