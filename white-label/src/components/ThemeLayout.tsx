'use client';

import React, { ReactNode } from 'react';
import { ThemeProvider } from '@cns/contexts/ThemeContext';
import { ThemeType } from '@cns/themes/themeConfig';

interface ThemeLayoutProps {
	children: ReactNode;
	themeType: ThemeType;
}

export default function ThemeLayout({ children, themeType }: ThemeLayoutProps) {
	return (
		<ThemeProvider initialTheme={themeType}>
			{children}
		</ThemeProvider>
	);
}

