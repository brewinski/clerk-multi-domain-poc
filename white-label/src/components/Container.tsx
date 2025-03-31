'use client';

import React, { ReactNode } from 'react';

interface ContainerProps {
	children: ReactNode;
	maxWidth?: string;
	padding?: string;
}

export default function Container({
	children,
	maxWidth = '1200px',
	padding = '0 2rem'
}: ContainerProps) {
	const containerStyles = {
		maxWidth,
		margin: '0 auto',
		padding,
		width: '100%',
	};

	return (
		<div style={containerStyles}>
			{children}
		</div>
	);
}

