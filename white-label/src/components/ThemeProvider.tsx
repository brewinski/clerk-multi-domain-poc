import React, { createContext, ReactNode, useEffect, useState } from 'react';
import themes, { ThemeConfig, ThemeType } from '../themes/themeConfig';

interface ThemeContextProps {
	theme: ThemeConfig;
	themeType: ThemeType;
	setThemeType: (theme: ThemeType) => void;
}

export const ThemeContext = createContext<ThemeContextProps>({
	theme: themes.canstarblue,
	themeType: 'canstarblue',
	setThemeType: () => { },
});

interface ThemeProviderProps {
	children: ReactNode;
	initialTheme?: ThemeType;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
	children,
	initialTheme = 'canstarblue'
}) => {
	const [themeType, setThemeType] = useState<ThemeType>(initialTheme);
	const [theme, setTheme] = useState<ThemeConfig>(themes[initialTheme]);

	useEffect(() => {
		setTheme(themes[themeType]);
	}, [themeType]);

	return (
		<ThemeContext.Provider value={{ theme, themeType, setThemeType }}>
			{children}
		</ThemeContext.Provider>
	);
};

