

import { Metadata } from 'next';
import { getThemeTypeFromHeaders } from '@cns/utils/serverTheme';
import ThemeLayout from '@cns/components/ThemeLayout';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';

export const metadata: Metadata = {
  title: 'Multi-domain App',
  description: 'Next.js multi-domain application with themed interfaces',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const themeType = await getThemeTypeFromHeaders();

  const primarySignInUrl = 'http://primary.localhost:3002/sign-in'
  const primarySignUpUrl = 'http://primary.localhost:3002/sign-up';

  return (
    <html lang="en">
      <body>
        <ClerkProvider
          isSatellite
          domain="canstar.localhost:3001"
          signInUrl={primarySignInUrl}
          signUpUrl={primarySignUpUrl}
        >
          <ThemeLayout themeType={themeType}>
            {children}
          </ThemeLayout>
        </ClerkProvider>
      </body>
    </html >
  );
}
