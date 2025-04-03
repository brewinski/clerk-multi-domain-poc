import { Metadata } from 'next';
import { getThemeTypeFromHeaders } from '@cns/utils/serverTheme';
import ThemeLayout from '@cns/components/ThemeLayout';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { auth0 } from '@cns/utils/auth0/auth0';

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
  const session = await auth0.getSession()

  return (
    <html lang="en">
      <body>
        {session && (
          <main>
            <h1>Welcome, {session.user.name}!</h1>
            <a href="/auth/logout">Log Out</a>
          </main>
        )}
        {!session && (
          <main>
            <a href="/auth/login?screen_hint=signup">Sign up</a>
            <a href="/auth/login">Log out</a>
          </main>
        )}
        {/*<ClerkProvider>*/}
        <ThemeLayout themeType={themeType}>
          {children}
        </ThemeLayout>
        {/*</ClerkProvider>*/}
      </body>
    </html >
  );
}
