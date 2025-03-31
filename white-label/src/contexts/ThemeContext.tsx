'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import themes, { ThemeConfig, ThemeType } from '@cns/themes/themeConfig';

interface ThemeContextType {
	theme: ThemeConfig;
	themeType: ThemeType;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	return context;
}

interface ThemeProviderProps {
	children: ReactNode;
	initialTheme: ThemeType;
}

export function ThemeProvider({ children, initialTheme }: ThemeProviderProps) {
	const themeConfig = themes[initialTheme];

	return (
		<ThemeContext.Provider value={{ theme: themeConfig, themeType: initialTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

