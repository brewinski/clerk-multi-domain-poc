import { UserProvider } from '@auth0/nextjs-auth0/client';
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

  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          <UserProvider>
            <ThemeLayout themeType={themeType}>
              {children}
            </ThemeLayout>
          </UserProvider>
        </ClerkProvider>
      </body>
    </html >
  );
}
