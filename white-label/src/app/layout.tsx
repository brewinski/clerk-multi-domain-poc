

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

  console.log("process env", process.env)

  const isSatellite = Boolean(process.env.NEXT_PUBLIC_CLERK_IS_SATELLITE)
  const signInUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL
  const signUpUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL
  const domain = process.env.NEXT_PUBLIC_CLERK_DOMAIN!
  const primarySignInUrl = signInUrl
  const primarySignUpUrl = signUpUrl

  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          <ThemeLayout themeType={themeType}>
            {children}
          </ThemeLayout>
        </ClerkProvider>
      </body>
    </html >
  );
}
