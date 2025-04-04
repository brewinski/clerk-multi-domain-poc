
import ThemedPage from '../../components/ThemedPage';
import Hero from '../../components/Hero';
import Container from '../../components/Container';
import FeaturesSection from '../../components/FeaturesSection';
import Card from '../../components/Card';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Canstar Blue",
  icons: {
    icon: `blue-favicon.ico`,
  },
}

export default function CanstarBlue() {
  const features = [
    {
      id: 1,
      title: "Consumer Reviews",
      description: "Read authentic reviews from real customers to make informed purchasing decisions on products and services.",
      icon: "⭐"
    },
    {
      id: 2,
      title: "Product Comparisons",
      description: "Side-by-side comparisons of popular products across categories to help you find the best value.",
      icon: "📱"
    },
    {
      id: 3,
      title: "Buying Guides",
      description: "Expert advice and tips on what to look for when shopping for appliances, electronics, and services.",
      icon: "📋"
    }
  ];

  return (<>
    <Hero
      title="Compare Products & Services"
      subtitle="Find the best value products with consumer reviews and expert recommendations"
      ctaText="Explore Categories"
    />

    <Container>
      <FeaturesSection
        title="Why Choose Canstar Blue"
        subtitle="Australia's trusted source for consumer product information and reviews"
        features={features}
      />

      <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Popular Categories</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <Card title="Electricity & Gas" accentColor={true}>
            <p>Compare energy providers and find the best deals to save on your power bills.</p>
            <p style={{ marginTop: '1rem' }}>
              <a href="#" style={{ color: '#2196F3', textDecoration: 'none', fontWeight: 'bold' }}>
                Compare Providers →
              </a>
            </p>
          </Card>
          <Card title="Appliances">
            <p>Find the best washing machines, refrigerators, air conditioners and more with consumer ratings.</p>
            <p style={{ marginTop: '1rem' }}>
              <a href="#" style={{ color: '#2196F3', textDecoration: 'none', fontWeight: 'bold' }}>
                Browse Appliances →
              </a>
            </p>
          </Card>
          <Card title="Mobile Phones" accentColor={true}>
            <p>Compare the latest smartphones and phone plans to find the right option for your needs.</p>
            <p style={{ marginTop: '1rem' }}>
              <a href="#" style={{ color: '#2196F3', textDecoration: 'none', fontWeight: 'bold' }}>
                View Phones →
              </a>
            </p>
          </Card>
        </div>
      </div>
    </Container>
  </>);
}
