import { NextRequest, NextResponse } from "next/server";
import { getAuth, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(['/user', "/credit-score/verification(.*)"]);
const isMFARoute = createRouteMatcher(['/some-mfa-route']);

function isCanstar(hostname: string) {
  return (hostname.startsWith("canstar") && !hostname.startsWith("canstarblue"));
}

function isCanstarBlue(hostname: string) {
  return hostname.startsWith("canstarblue");
}

function hostSiteMiddleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host")!
    .replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);
  const searchParams = url.searchParams.toString();
  const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`;
  const requestHeaders = new Headers(req.headers);

  if (isCanstar(hostname)) {
    requestHeaders.set('x-domain-type', 'canstar');
    return NextResponse.rewrite(new URL(`/canstar${path}`, req.url), {
      request: { headers: requestHeaders }
    });
  }

  if (isCanstarBlue(hostname)) {
    requestHeaders.set('x-domain-type', 'canstarblue');
    return NextResponse.rewrite(new URL(`/canstarblue${path}`, req.url), {
      request: { headers: requestHeaders }
    });
  }

  requestHeaders.set('x-domain-type', 'canstar');
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Run shared domain rewrite logic first
  const response = hostSiteMiddleware(req);

  // Only apply Clerk session logic to protected routes
  if (isProtectedRoute(req) || isMFARoute(req)) {
    const { userId, sessionClaims } = getAuth(req);

    if (!userId) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    if (isMFARoute(req)) {
      if (sessionClaims?.isMfa === false) {
        return NextResponse.redirect(new URL("/account/manage-mfa/", req.url));
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
