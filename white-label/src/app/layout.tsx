

import { Metadata } from 'next';
import { getThemeTypeFromHeaders } from '@cns/utils/serverTheme';
import ThemeLayout from '@cns/components/ThemeLayout';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import Head from 'next/head';

export const metadata: Metadata = {
  title: 'Multi-domain App',
  description: 'Next.js multi-domain application with themed interfaces',
};


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <meta name="robots" content="all" />
      <meta name="google-site-verification" content="P9z0uYnscP75CoOnAOCAU-7ekJUfzdkuDfEHKkB8yDk" />
      <body>
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html >
  );
}
