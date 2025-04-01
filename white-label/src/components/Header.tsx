'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@cns/contexts/ThemeContext';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';

export default function Header() {
	const { theme, themeType } = useTheme();
	const pathname = usePathname();
	const [scrolled, setScrolled] = useState(false);
	const [isLoggedIn,] = useState(false);

	// We'll use the logo config from the theme

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
		//marginBottom: '1rem',
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

	const leftSectionStyle: React.CSSProperties = {
		display: 'flex',
		alignItems: 'center',
		height: '100%',
		paddingLeft: '2rem',
	};

	const navSectionStyle: React.CSSProperties = {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
		height: '100%',
	};

	const rightSectionStyle: React.CSSProperties = {
		display: 'flex',
		alignItems: 'center',
		gap: '1rem',
		height: '100%',
		paddingRight: '2rem',
	};

	const navStyle: React.CSSProperties = {
		display: 'flex',
		gap: '1.5rem',
		height: '100%',
		alignItems: 'center',
	};

	const linkStyle = (isActive: boolean): React.CSSProperties => ({
		color: '#333',
		textDecoration: 'none',
		fontWeight: isActive ? 'bold' : 'normal',
		fontSize: '1rem',
		padding: '0.5rem 1rem',
		borderRadius: theme.borderRadius,
		transition: 'all 0.3s ease',
		position: 'relative',
		height: '100%',
		display: 'flex',
		alignItems: 'center',
	});

	const logoContainerStyle: React.CSSProperties = {
		display: 'flex',
		alignItems: 'center',
		height: '100%',
		marginRight: '2rem',
	};

	const logoImageStyle: React.CSSProperties = {
		width: 'auto',
		height: '55px',
		objectFit: 'contain',
	};

	const navItemStyle: React.CSSProperties = {
		position: 'relative',
		height: '100%',
		display: 'flex',
		alignItems: 'center',
	};

	const activeIndicatorStyle = (isActive: boolean): React.CSSProperties => ({
		position: 'absolute',
		bottom: 0,
		left: '50%',
		width: isActive ? '70%' : '0%',
		height: '3px',
		backgroundColor: theme.logo.color,
		transform: 'translateX(-50%)',
		transition: 'width 0.3s ease',
	});

	const buttonStyle = (isPrimary: boolean): React.CSSProperties => ({
		backgroundColor: isPrimary
			? theme.logo.color
			: 'transparent',
		color: isPrimary
			? theme.logo.textColor
			: theme.logo.color,
		border: isPrimary ? 'none' : `1px solid ${theme.logo.color}`,
		borderRadius: theme.borderRadius,
		padding: '0.5rem 1rem',
		fontWeight: 'medium',
		cursor: 'pointer',
		transition: 'all 0.2s ease',
	});

	const userAvatarStyle: React.CSSProperties = {
		width: '35px',
		height: '35px',
		borderRadius: '50%',
		backgroundColor: '#f0f0f0',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		color: '#666',
		fontSize: '16px',
		fontWeight: 'bold',
		cursor: 'pointer',
	};

	const isActiveLink = (href: string): boolean => {
		if (href === '/') return pathname === '/';
		return pathname ? pathname.startsWith(href) : false;
	};

	return (
		<header style={headerStyle}>
			<div style={leftSectionStyle}>
				<div style={logoContainerStyle}>
					<Link href="/" style={{ textDecoration: 'none' }}>
						{/* Replace with actual image paths when available */}
						<div style={logoImageStyle}>
							{/* Using theme-based logo with fallback text */}
							<div style={{ position: 'relative', height: '55px', width: 'auto' }}>
								<Image
									src={theme.logo.imageUrl}
									alt={`${themeType} Logo`}
									width={150}
									height={45}
									style={logoImageStyle}
									onError={(e) => {
										// Fallback to text if image fails to load
										const target = e.target as HTMLImageElement;
										target.style.display = 'none';
									}}
								/>
							</div>
							<span style={{
								color: theme.logo.color,
								fontWeight: 'bold',
								fontSize: '1.25rem',
								display: 'none', // Only show if image fails to load
							}}>
								{theme.logo.text}
							</span>
						</div>
					</Link>
				</div>
			</div>

			<div style={navSectionStyle}>
				<nav style={navStyle}>
					<div style={navItemStyle}>
						<Link href="/" style={linkStyle(isActiveLink('/'))}>
							Home
							<div style={activeIndicatorStyle(isActiveLink('/'))}></div>
						</Link>
					</div>
					<div style={navItemStyle}>
						<Link href="/canstar" style={linkStyle(isActiveLink('/canstar'))}>
							Canstar
							<div style={activeIndicatorStyle(isActiveLink('/canstar'))}></div>
						</Link>
					</div>
					<div style={navItemStyle}>
						<Link href="/canstarblue" style={linkStyle(isActiveLink('/canstarblue'))}>
							Canstar Blue
							<div style={activeIndicatorStyle(isActiveLink('/canstarblue'))}></div>
						</Link>
					</div>
				</nav>
			</div>

			<div style={rightSectionStyle}>
				{isLoggedIn ? (
					<div style={userAvatarStyle}>
						<span>U</span>
					</div>
				) : (
					<>
						<SignedIn>
							<UserButton />
						</SignedIn>
						<SignedOut>
							<SignInButton>
								<button style={buttonStyle(false)}>Sign In</button>
							</SignInButton>
							<SignUpButton>
								<button style={buttonStyle(true)}>Sign Up</button>
							</SignUpButton>
						</SignedOut>
					</>
				)}
			</div>
		</header>
	);
}

