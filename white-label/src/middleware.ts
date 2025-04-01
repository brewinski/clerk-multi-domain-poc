import { NextRequest, NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

function isCanstar(hostname: string) {
  return (hostname.startsWith("canstar") && !hostname.startsWith("canstarblue"))
}

function isCanstarBlue(hostname: string) {
  return hostname.startsWith("canstarblue")
}


function hostSiteMiddleware(req: NextRequest) {
  const url = req.nextUrl;
  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
  const hostname = req.headers
    .get("host")!
    .replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);

  const searchParams = req.nextUrl.searchParams.toString();
  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`;

  console.log("HOST", hostname, "PATH", path);

  if (isCanstar(hostname)) {
    console.log("isCanstar");
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
    console.log("isCanstarBlue");
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
const isProtectedRoute = createRouteMatcher(['/user'])


export default clerkMiddleware(async (auth, req) => {
  console.log("clerk middleware")
  if (isProtectedRoute(req)) {
    console.log("protect")
    await auth.protect()
    return
  }

  console.log("next middleware")

  return hostSiteMiddleware(req)

})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
