

import { Metadata } from 'next';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Multi-domain App',
  description: 'Next.js multi-domain application with themed interfaces',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cook = await cookies()
  const clerkRedirectValue = cook.get("__clerk_redirect_count")

  return (
    <html lang="en">
      <meta name="robots" content="all" />
      <meta name="google-site-verification" content="P9z0uYnscP75CoOnAOCAU-7ekJUfzdkuDfEHKkB8yDk" />
      <head>
        {clerkRedirectValue?.value === "3" && (
          <script async>
            if (window.location)
            const [key, value] = ['__clerk_synced', 'true'];
            const url = new URL(window.location.href);
            url.searchParams.set(key, value);
            window.history.replaceState(window.history.state, '', url);
            console.log("Running ClerkSyncUrlEffectComponent");
          </script>
        )}
      </head>
      <body>
        <ClerkProvider
          appearance={{
            variables: {
              colorPrimary: "#0095a9",
              colorNeutral: "#000000",
            },
            layout: {
              socialButtonsVariant: 'iconButton',
              termsPageUrl: 'https://clerk.com/terms',
            },
          }}
        >
          {children}
        </ClerkProvider>
      </body>
    </html >
  );
}
