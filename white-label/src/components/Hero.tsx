'use client';

import React from 'react';
import Container from './Container';
import { useTheme } from '@cns/contexts/ThemeContext';

interface HeroProps {
	title: string;
	subtitle: string;
	ctaText?: string;
	//onCtaClick?: () => void;
}

export default function Hero({ title, subtitle, ctaText }: HeroProps) {
	const { theme } = useTheme();

	const heroStyle = {
		background: `linear-gradient(to right, ${theme.colors.gradient.from}, ${theme.colors.gradient.to})`,
		color: 'white',
		padding: '4rem 0', // py-16 equivalent
	};

	const buttonStyle = {
		backgroundColor: 'white',
		color: theme.colors.primary,
		padding: '0.75rem 1.5rem', // px-6 py-3 equivalent
		borderRadius: theme.borderRadius,
		fontWeight: 600, // semibold equivalent
		fontSize: '1.125rem', // text-lg equivalent
		transition: 'background-color 0.3s',
	};

	return (
		<div style={heroStyle}>
			<Container>
				<div className="max-w-3xl mx-auto text-center">
					<h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
					<p className="text-xl md:text-2xl mb-8">{subtitle}</p>
					{ctaText && (
						<button
							//onClick={onCtaClick}
							style={buttonStyle}
							className="hover:bg-opacity-90"
						>
							{ctaText}
						</button>
					)}
				</div>
			</Container>
		</div>
	);
}

