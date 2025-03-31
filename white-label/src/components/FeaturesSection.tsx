'use client';

import React from 'react';
import { useTheme } from '@cns/contexts/ThemeContext';
import Card from './Card';

interface Feature {
	id: number;
	title: string;
	description: string;
	icon?: React.ReactNode;
}

interface FeaturesSectionProps {
	title: string;
	subtitle: string;
	features: Feature[];
}

export default function FeaturesSection({ title, subtitle, features }: FeaturesSectionProps) {
	const { theme } = useTheme();

	const sectionStyles = {
		padding: '3rem 0',
		backgroundColor: theme.colors.background,
	};

	const headerStyles = {
		textAlign: 'center' as const,
		marginBottom: '3rem',
	};

	const titleStyles = {
		fontSize: '2rem',
		color: theme.colors.primary,
		marginBottom: '1rem',
	};

	const subtitleStyles = {
		fontSize: '1.1rem',
		color: theme.colors.text,
		opacity: 0.8,
		maxWidth: '700px',
		margin: '0 auto',
	};

	const gridStyles = {
		display: 'grid',
		gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
		gap: '2rem',
	};

	return (
		<section style={sectionStyles}>
			<div style={headerStyles}>
				<h2 style={titleStyles}>{title}</h2>
				<p style={subtitleStyles}>{subtitle}</p>
			</div>

			<div style={gridStyles}>
				{features.map((feature, index) => (
					<Card
						key={feature.id}
						title={feature.title}
						accentColor={index % 2 === 0}
						icon={feature.icon}
					>
						<p style={{ lineHeight: '1.6' }}>{feature.description}</p>
					</Card>
				))}
			</div>
		</section>
	);
}

