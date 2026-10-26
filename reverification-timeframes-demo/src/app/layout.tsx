import type { Metadata } from 'next'
import { ClerkProvider, Show, SignInButton, UserButton } from '@clerk/nextjs'

export const metadata: Metadata = {
  title: 'Custom reverification timeframes',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0, padding: '2rem' }}>
          <header style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
            <Show when="signed-in" fallback={<SignInButton />}>
              <UserButton />
            </Show>
          </header>
          <main style={{ maxWidth: 640, margin: '0 auto' }}>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  )
}
