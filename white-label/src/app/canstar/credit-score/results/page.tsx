'use client';

import ThemedPage from "@cns/components/ThemedPage";
import { useTheme } from '@cns/contexts/ThemeContext';
import Image from 'next/image';

export default function CreditScoreResultsPage() {
  const { theme } = useTheme();

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
  };

  const heroStyle = {
    position: 'relative' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    textAlign: 'center' as const,
    color: '#ffffff',

    marginBottom: '2rem',
    overflow: 'hidden',
  };

  const heroOverlayStyle = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay for text readability
    zIndex: 1,
  };

  const heroContentStyle = {
    position: 'relative' as const,
    zIndex: 2, // Position above the image and overlay
    maxWidth: '900px',
  };

  const sectionStyle = {
    marginBottom: '3rem',
  };

  const headingStyle = {
    color: theme.colors.primary,
    marginBottom: '1rem',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    marginTop: '2rem',
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    padding: '1.5rem',
    borderRadius: theme.borderRadius,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    textAlign: 'center' as const,
  };

  const ctaButtonStyle = {
    backgroundColor: theme.colors.primary,
    color: '#ffffff',
    border: 'none',
    padding: '1rem 2rem',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    borderRadius: theme.borderRadius,
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
  };

  const secondaryButtonStyle = {
    ...ctaButtonStyle,
    backgroundColor: theme.colors.secondary,
    marginLeft: '1rem',
  };

  const testimonialStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    padding: '2rem',
    backgroundColor: '#f9f9f9',
    borderRadius: theme.borderRadius,
    margin: '1rem 0',
  };

  const stepCardStyle = {
    ...cardStyle,
    borderLeft: `4px solid ${theme.colors.accent}`,
    textAlign: 'left' as const,
    alignItems: 'flex-start',
  };

  return (
    <ThemedPage>
      {/* Hero section moved outside the container for true full-width */}
      <section style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: "auto",
        padding: 0,
        marginBottom: 0,
      }}>
        {/* Full width image that maintains aspect ratio */}
        <Image
          src="/dashboard-example-pt1.png"
          alt="test"
          width={1920}
          height={0}
          style={{
            width: '90%',
            height: 'auto',
            zIndex: 0,
          }}
          sizes="90vw"
          quality={90}
        />
      </section>
    </ThemedPage>
  );
}
