'use client';

import { useClerk, useReverification, useUser, } from "@clerk/nextjs";
import ThemedPage from "@cns/components/ThemedPage";
import { useTheme } from '@cns/contexts/ThemeContext';
import Image from 'next/image';
import { check, verify } from "./actions";
import { redirect, useRouter } from "next/navigation";
import { useState } from 'react';

export default function CreditScorePage() {
  const router = useRouter()
  const { theme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: '',
    content: '',
    buttonText: '',
    onButtonClick: () => { }
  });

  const openModal = (title: any, content: any, buttonText: any, onButtonClick: any) => {
    setModalContent({
      title,
      content,
      buttonText,
      onButtonClick
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const reverify = useReverification(
    check,
  )

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
    justifyContent: 'center',
    textAlign: 'center' as const,
    padding: '6rem 1rem',
    color: '#ffffff',

    marginBottom: '2rem',
    minHeight: '500px',
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

  // Modal component
  const Modal = () => {
    if (!isModalOpen) return null;

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: theme.borderRadius,
          padding: '2rem',
          maxWidth: '500px',
          width: '90%',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
          }}>
            <h2 style={{ color: theme.colors.primary, margin: 0 }}>{modalContent.title}</h2>
            <button
              onClick={closeModal}
              style={{
                border: 'none',
                background: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#666',
              }}
            >
              ×
            </button>
          </div>
          <div style={{ margin: '1.5rem 0' }}>
            <p>{modalContent.content}</p>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end'
          }}>
            <button
              onClick={() => {
                modalContent.onButtonClick();
                closeModal();
              }}
              style={{
                ...ctaButtonStyle,
                padding: '0.75rem 1.5rem',
              }}
            >
              {modalContent.buttonText}
            </button>
            <button
              onClick={closeModal}
              style={{
                backgroundColor: '#f1f1f1',
                color: '#333',
                border: 'none',
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                borderRadius: theme.borderRadius,
                cursor: 'pointer',
                marginLeft: '0.75rem',
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ThemedPage>
      {/* Modal component */}
      <Modal />
      {/* Hero section moved outside the container for true full-width */}
      <section style={{
        ...heroStyle,
        borderRadius: 0, // Remove border radius for full-width appearance
        marginBottom: 0, // Remove margin
        width: '100%', // Ensure full width

      }}>
        {/* Full width hero image with fill property */}
        <a onClick={async () => {
          try {
            const resp = await reverify()
            console.log("reverify resp:", resp)
            if (resp.success) {
              router.push("/credit-score/verification")
              return
            }

            if (resp.totp?.metadata.verified === true) {
              openModal(
                "Verification required (Custom Provider [Twillio])",
                `Enter the code sent to your phone to continue ${resp.totp.metadata.phonenumber}`,
                "Verify",
                async () => {
                  try {
                    await verify("000000")

                    const resp = await reverify()
                    if (resp.success) {
                      router.push("/credit-score/verification")
                      return
                    }
                  } catch (err) {
                    console.error(err)
                  }

                }
              );
            }

            if (resp.totp?.metadata.verified === false) {
              openModal(
                "This feature requires MFA (Custom Provider [Twillio])",
                `Verify a phone number: [ pretend this is a textbox ${resp.totp.metadata.phonenumber}]`,
                "Verify",
                async () => {
                  try {
                    await verify("000000")

                    const resp = await reverify()
                    if (resp.success) {
                      router.push("/credit-score/verification")
                      return
                    }
                  } catch (err) {
                    console.error(err)
                  }

                }
              );
            }
          } catch (err) {
            console.error(err)
          }
        }} >
          <Image

            src="/credit-score-landing.png"
            alt="Credit score background"
            fill
            priority // Important for LCP (Largest Contentful Paint) optimization
            style={{
              objectFit: 'cover',
              objectPosition: 'center',
              zIndex: 0, // Place below content
            }}
            sizes="100vw" // Important for responsive optimization
            quality={90} // Higher quality for hero image
          />
        </a>

      </section>

      <section style={{
        ...heroStyle,
        borderRadius: 0, // Remove border radius for full-width appearance
        marginBottom: 0, // Remove margin
        width: '100%', // Ensure full width
      }}>

        {/* Full width hero image with fill property */}
        <Image
          src="/how-get-score.png"
          alt="Credit score background"
          fill
          priority // Important for LCP (Largest Contentful Paint) optimization
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
            zIndex: 0, // Place below content
          }}
          sizes="100vw" // Important for responsive optimization
          quality={90} // Higher quality for hero image
        />
      </section>

      <div style={containerStyle}>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>Why Check Your Credit Score?</h2>
          <div style={gridStyle}>
            <div style={cardStyle}>
              <div style={{ marginBottom: '1rem' }}>
                {/* Placeholder for image - in real app would use Image component with actual image path */}
                <div style={{ width: '80px', height: '80px', backgroundColor: theme.colors.accent, borderRadius: '50%', margin: '0 auto' }}></div>
              </div>
              <h3>Know Where You Stand</h3>
              <p>Understand your current credit position and how lenders view your financial health.</p>
            </div>
            <div style={cardStyle}>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ width: '80px', height: '80px', backgroundColor: theme.colors.primary, borderRadius: '50%', margin: '0 auto' }}></div>
              </div>
              <h3>Spot Potential Issues</h3>
              <p>Identify and address problems before applying for credit to improve your chances of approval.</p>
            </div>
            <div style={cardStyle}>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ width: '80px', height: '80px', backgroundColor: theme.colors.secondary, borderRadius: '50%', margin: '0 auto' }}></div>
              </div>
              <h3>Better Loan Rates</h3>
              <p>A higher credit score typically leads to better interest rates and loan terms from lenders.</p>
            </div>
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>How It Works</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={stepCardStyle}>
              <h3 style={{ color: theme.colors.accent }}>Step 1: Sign Up</h3>
              <p>Create your free account in just a few minutes with basic information.</p>
            </div>
            <div style={stepCardStyle}>
              <h3 style={{ color: theme.colors.accent }}>Step 2: Verify Your Identity</h3>
              <p>We securely verify your identity to ensure your information is protected.</p>
            </div>
            <div style={stepCardStyle}>
              <h3 style={{ color: theme.colors.accent }}>Step 3: Get Your Score</h3>
              <p>Instantly receive your credit score and a detailed breakdown of factors affecting it.</p>
            </div>
            <div style={stepCardStyle}>
              <h3 style={{ color: theme.colors.accent }}>Step 4: Track & Improve</h3>
              <p>Monitor your score monthly and follow personalized recommendations to improve it over time.</p>
            </div>
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>What Our Users Say</h2>
          <div style={testimonialStyle}>
            <p style={{ fontSize: '1.1rem', fontStyle: 'italic', marginBottom: '1rem' }}>
              "I had no idea my credit score was impacting my loan applications. After using this service,
              I was able to identify issues and improve my score by 100 points in just 6 months!"
            </p>
            <div style={{ fontWeight: 'bold' }}>Sarah T., Melbourne</div>
          </div>
          <div style={testimonialStyle}>
            <p style={{ fontSize: '1.1rem', fontStyle: 'italic', marginBottom: '1rem' }}>
              "The insights provided were eye-opening. I discovered a reporting error that was dragging down my score
              and was able to get it corrected right away."
            </p>
            <div style={{ fontWeight: 'bold' }}>James B., Sydney</div>
          </div>
        </section>

        <section style={{ ...sectionStyle, textAlign: 'center', padding: '2rem', backgroundColor: '#f9f9f9', borderRadius: theme.borderRadius }}>
          <h2 style={{ ...headingStyle, marginBottom: '1.5rem' }}>Ready to Take Control of Your Credit?</h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem', maxWidth: '800px', margin: '0 auto 2rem' }}>
            Join thousands of Australians who have improved their financial health with our credit score service.
          </p>
          <button
            style={{ ...ctaButtonStyle, padding: '1.2rem 3rem' }}
            onClick={() => {
              openModal(
                "Get Your Free Credit Score",
                "Our secure service gives you instant access to your credit score along with personalized recommendations to improve it.",
                "Check My Score",
                async () => {
                  try {
                    const resp = await reverify()
                    console.log("reverify resp:", resp)
                    if (resp.success) {
                      router.push("/credit-score/verification")
                    }
                  } catch (err) {
                    console.error(err)
                  }
                }
              );
            }}
          >
            Get My Free Credit Score
          </button>
        </section>
      </div>
    </ThemedPage>
  );
}
