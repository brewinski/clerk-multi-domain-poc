'use client';

import React from 'react';
import { useTheme } from '@cns/contexts/ThemeContext';

interface CtaSectionProps {
	title: string;
	description: string;
	buttonText: string;
	onButtonClick?: () => void;
	imageUrl?: string;
}

export default function CtaSection({
	title,
	description,
	buttonText,
	onButtonClick,
	imageUrl
}: CtaSectionProps) {
	const { theme } = useTheme();

	const sectionStyles = {
		padding: '4rem 2rem',
		backgroundColor: theme.colors.primary,
		color: 'white',
		borderRadius: theme.borderRadius,
		margin: '3rem 0',
		display: 'flex',
		flexDirection: imageUrl ? 'row' as const : 'column' as const,
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: '2rem',
		flexWrap: 'wrap' as const,
	};

	const contentStyles = {
		flex: '1',
		minWidth: '300px',
	};

	const titleStyles = {
		fontSize: '2rem',
		marginBottom: '1rem',
	};

	const descriptionStyles = {
		fontSize: '1.1rem',
		marginBottom: '2rem',
		opacity: 0.9,
	};

	const buttonStyles = {
		backgroundColor: 'white',
		color: theme.colors.primary,
		border: 'none',
		padding: '0.75rem 1.5rem',
		borderRadius: theme.borderRadius,
		fontSize: '1.1rem',
		cursor: 'pointer',
		fontWeight: 'bold' as const,
		transition: 'all 0.3s ease',
	};

	const imageStyles = {
		flex: '1',
		minWidth: '300px',
		borderRadius: theme.borderRadius,
		overflow: 'hidden',
		maxWidth: '500px',
	};

	return (
		<section style={sectionStyles}>
			<div style={contentStyles}>
				<h2 style={titleStyles}>{title}</h2>
				<p style={descriptionStyles}>{description}</p>
				<button
					style={buttonStyles}
					onClick={onButtonClick}
					onMouseOver={(e) => {
						e.currentTarget.style.backgroundColor = theme.colors.accent;
						e.currentTarget.style.color = 'white';
						e.currentTarget.style.transform = 'scale(1.05)';
					}}
					onMouseOut={(e) => {
						e.currentTarget.style.backgroundColor = 'white';
						e.currentTarget.style.color = theme.colors.primary;
						e.currentTarget.style.transform = 'scale(1)';
					}}
				>
					{buttonText}
				</button>
			</div>

			{imageUrl && (
				<div style={imageStyles}>
					<img
						src={imageUrl}
						alt={title}
						style={{ width: '100%', height: 'auto', display: 'block' }}
					/>
				</div>
			)}
		</section>
	);
}

