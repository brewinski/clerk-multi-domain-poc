'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';

export default function Header() {
	const [scrolled, setScrolled] = useState(false);

	// Detect scroll for adding shadow effect
	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 10);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const headerStyle: React.CSSProperties = {
		backgroundColor: 'white',
		color: '#333',
		padding: '0',
		height: '80px',
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		boxShadow: scrolled ? '0 4px 12px rgba(0, 0, 0, 0.1)' : '0 1px 3px rgba(0, 0, 0, 0.05)',
		transition: 'box-shadow 0.3s ease',
		position: 'sticky',
		top: '0',
		zIndex: 1000,
		width: '100%',
	};

	const logoSectionStyle: React.CSSProperties = {
		display: 'flex',
		alignItems: 'center',
		height: '100%',
		paddingLeft: '2rem',
		gap: '2rem',
	};

	const rightSectionStyle: React.CSSProperties = {
		display: 'flex',
		alignItems: 'center',
		gap: '1rem',
		height: '100%',
		paddingRight: '2rem',
	};

	const logoContainerStyle: React.CSSProperties = {
		display: 'flex',
		alignItems: 'center',
		height: '100%',
	};

	const logoImageStyle: React.CSSProperties = {
		width: 'auto',
		height: '55px',
		objectFit: 'contain',
	};

	const buttonStyle = (isPrimary: boolean): React.CSSProperties => ({
		backgroundColor: isPrimary
			? '#0095a9'
			: 'transparent',
		color: isPrimary
			? '#FFFFFF'
			: '#0095a9',
		border: isPrimary ? 'none' : `1px solid #0095a9`,
		borderRadius: '4px',
		padding: '0.5rem 1rem',
		fontWeight: 'medium',
		cursor: 'pointer',
		transition: 'all 0.2s ease',
	});

	return (
		<header style={headerStyle}>
			<div style={logoSectionStyle}>
				{/* Canstar Logo */}
				<div style={logoContainerStyle}>
					<Link href="/" style={{ textDecoration: 'none' }}>
						<div style={{ position: 'relative', height: '55px', width: 'auto' }}>
							<Image
								src="https://www.canstar.com.au/wp-content/themes/canstar/dist/images/logo.png"
								alt="Canstar Logo"
								width={150}
								height={45}
								style={logoImageStyle}
							/>
						</div>
					</Link>
				</div>

				{/* Canstar Blue Logo */}
				<div style={logoContainerStyle}>
					<Link href="/" style={{ textDecoration: 'none' }}>
						<div style={{ position: 'relative', height: '55px', width: 'auto' }}>
							<Image
								src="https://www.canstarblue.com.au/wp-content/themes/canstar-blue/dist/images/logo.png"
								alt="Canstar Blue Logo"
								width={150}
								height={45}
								style={logoImageStyle}
							/>
						</div>
					</Link>
				</div>
			</div>

			<div style={rightSectionStyle}>
				<SignedIn>
					<UserButton />
				</SignedIn>
			</div>
		</header>
	);
}

