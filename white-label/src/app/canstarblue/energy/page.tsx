import Image from "next/image"

export default function Page() {
  const heroStyle = {
    position: 'relative' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center' as const,
    padding: '6rem 1rem',
    color: '#ffffff',

    marginBottom: '2rem',
    minHeight: '500px',
    overflow: 'hidden',
  };

  return <div style={{ display: 'flex', justifyContent: 'center', margin: "2rem 1rem" }}>

    <section style={{
      ...heroStyle,
      borderRadius: 0, // Remove border radius for full-width appearance
      marginBottom: 0, // Remove margin
      width: '100%', // Ensure full width
    }}>
      <Image
        src="/canstarblue-energy-pt1.png"
        alt="Credit score background"
        fill
        priority // Important for LCP (Largest Contentful Paint) optimization
        style={{
          objectFit: 'contain',
          objectPosition: 'center',
          zIndex: 0, // Place below content
        }}
        sizes="80vw" // Important for responsive optimization
        quality={90} // Higher quality for hero image
      />
    </section>
  </div>
}
