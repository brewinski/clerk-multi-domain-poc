'use client';

import { useTheme } from '@cns/contexts/ThemeContext';
import React, { ReactNode } from 'react';

interface CardProps {
	title: string;
	children: ReactNode;
	accentColor?: boolean;
}

export default function Card({ title, children, accentColor = false }: CardProps) {
	const { theme } = useTheme();

	const accentBorderStyle = accentColor ? {
		borderLeftWidth: '4px',
		borderLeftColor: theme.colors.accent
	} : {};

	return (
		<div
			className="rounded-lg shadow-md overflow-hidden"
			style={accentBorderStyle}
		>
			<div className="p-5">
				<h3 className="text-xl font-semibold mb-3">{title}</h3>
				{children}
			</div>
		</div>
	);
}

