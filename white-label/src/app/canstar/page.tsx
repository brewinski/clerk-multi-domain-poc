import ThemedPage from '@cns/components/ThemedPage';
import Hero from '@cns/components/Hero';
import Container from '@cns/components/Container';
import FeaturesSection from '@cns/components/FeaturesSection';
import Card from '@cns/components/Card';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Canstar",
  icons: {
    icon: `gold-favicon.ico`,
  },
}

export default function Canstar() {
  const features = [
    {
      id: 1,
      title: "Financial Ratings",
      description: "Independent ratings and comparisons of financial products to help you find the best options available.",
      icon: "🏆"
    },
    {
      id: 2,
      title: "Money Guides",
      description: "Expert advice and tips on managing your finances, from savings accounts to home loans and insurance.",
      icon: "💰"
    },
    {
      id: 3,
      title: "Financial Calculators",
      description: "Interactive tools to help you plan your finances, calculate loan repayments, and compare products.",
      icon: "🧮"
    }
  ];

  return (
    <ThemedPage>
      <Hero
        title="Compare Financial Products"
        subtitle="Find the best value financial products with expert ratings and comparisons"
        ctaText="Start Comparing"
      />

      <Container>
        <FeaturesSection
          title="Why Choose Canstar"
          subtitle="Australia's leading financial comparison site with over 30 years of experience"
          features={features}
        />
        <Link href="/page" >Page</Link>
        <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>Popular Categories</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <Card title="Home Loans" accentColor={true}>
              <p>Compare home loan rates and features to find the best mortgage for your needs.</p>
              <p style={{ marginTop: '1rem' }}>
                <a href="#" style={{ color: '#2196F3', textDecoration: 'none', fontWeight: 'bold' }}>
                  Compare Home Loans →
                </a>
              </p>
            </Card>
            <Card title="Credit Cards">
              <p>Find the right credit card with low rates, reward programs, or no annual fees.</p>
              <p style={{ marginTop: '1rem' }}>
                <a href="#" style={{ color: '#2196F3', textDecoration: 'none', fontWeight: 'bold' }}>
                  Browse Credit Cards →
                </a>
              </p>
            </Card>
            <Card title="Insurance" accentColor={true}>
              <p>Compare insurance policies for health, car, home, life, and travel to protect what matters most.</p>
              <p style={{ marginTop: '1rem' }}>
                <a href="#" style={{ color: '#2196F3', textDecoration: 'none', fontWeight: 'bold' }}>
                  View Insurance →
                </a>
              </p>
            </Card>
          </div>
        </div>
      </Container>
    </ThemedPage>
  );
}
