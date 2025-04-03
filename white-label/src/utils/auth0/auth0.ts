import { Auth0Client } from "@auth0/nextjs-auth0/server"

export const auth0 = new Auth0Client({
  appBaseUrl: process.env.NEXT_PUBLIC_APP_BASE_URL,
  clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_AUTH0_CLIENT_SECRET,
  domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
  secret: process.env.NEXT_PUBLIC_AUTH0_SECRET,
})

