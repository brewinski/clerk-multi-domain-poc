'use client';

import React, { ReactNode } from 'react';
import { useTheme } from '@cns/contexts/ThemeContext';
import Header from './Header';
import Footer from './Footer';

interface ThemedPageProps {
	children: ReactNode;
}

export default function ThemedPage({ children }: ThemedPageProps) {
	const { theme, themeType } = useTheme();

	// Inline styles for demonstration
	const pageStyle = {
		backgroundColor: theme.colors.background,
		color: theme.colors.text,
		fontFamily: theme.fontFamily,
		minHeight: '100vh',
		display: 'flex',
		flexDirection: 'column' as const,
	};

	const mainStyle = {
		flex: '1',
	};

	const buttonStyle = {
		backgroundColor: theme.colors.secondary,
		color: '#fff',
		border: 'none',
		padding: '0.5rem 1rem',
		borderRadius: theme.borderRadius,
		cursor: 'pointer',
		marginTop: '1rem',
	};

	return (
		<div style={pageStyle}>
			<main style={mainStyle}>
				{children}

				<div style={{ marginTop: '2rem' }}>
					<h3 style={{ color: theme.colors.accent }}>Theme Demonstration</h3>
					<p>This page is styled according to the {themeType} theme.</p>
					<p>Primary color: {theme.colors.primary}</p>
					<p>Secondary color: {theme.colors.secondary}</p>
					<p>Accent color: {theme.colors.accent}</p>
					<button style={buttonStyle}>Themed Button</button>
				</div>
			</main>
			<Footer />
		</div>
	);
}

