'use client';

import React, { ReactNode } from 'react';
import { useTheme } from '@cns/contexts/ThemeContext';

interface ContentSectionProps {
	title: string;
	subtitle?: string;
	children: ReactNode;
	fullWidth?: boolean;
	backgroundColor?: string;
}

export default function ContentSection({
	title,
	subtitle,
	children,
	fullWidth = false,
	backgroundColor
}: ContentSectionProps) {
	const { theme } = useTheme();

	const sectionStyles = {
		padding: '3rem 0',
		backgroundColor: backgroundColor || 'transparent',
	};

	const containerStyles = {
		maxWidth: fullWidth ? '100%' : '1200px',
		margin: '0 auto',
		padding: '0 2rem',
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
		marginBottom: '2rem',
	};

	return (
		<section style={sectionStyles}>
			<div style={containerStyles}>
				<h2 style={titleStyles}>{title}</h2>
				{subtitle && <p style={subtitleStyles}>{subtitle}</p>}
				<div>{children}</div>
			</div>
		</section>
	);
}

