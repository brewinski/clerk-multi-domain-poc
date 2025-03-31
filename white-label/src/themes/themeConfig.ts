export type ThemeType = 'canstar' | 'canstarblue';

export interface ThemeColors {
	primary: string;
	secondary: string;
	background: string;
	text: string;
	accent: string;
	gradient: {
		from: string;
		to: string;
	};
}

export interface LogoConfig {
	text: string;
	color: string;
	textColor: string;
	imageUrl: string;
}

export interface ThemeConfig {
	colors: ThemeColors;
	fontFamily: string;
	borderRadius: string;
	logo: LogoConfig;
	footerColor: string;
}

const themes: Record<ThemeType, ThemeConfig> = {
	canstar: {
		colors: {
			primary: '#0095a9',
			secondary: '#2196F3',
			background: '#F5F5F5',
			text: '#333333',
			accent: '#FF5722',
			gradient: {
				from: '#0095a9',
				to: '#006d7c', // darker teal for a more brand-appropriate gradient
			},
		},
		fontFamily: '"Roboto", sans-serif',
		borderRadius: '4px',
		logo: {
			text: 'CANSTAR',
			color: '#0095a9',
			textColor: '#FFFFFF',
			imageUrl: 'https://www.canstar.com.au/wp-content/themes/canstar/dist/images/logo.png',
		},
		footerColor: '#212121',
	},
	canstarblue: {
		colors: {
			primary: '#2196F3',
			//secondary: '#03A9F4',
			secondary: '#1899d6',
			background: '#F5F5F5',
			text: '#212121',
			accent: '#009688',
			gradient: {
				from: '#2196F3',
				to: '#1899d6', // keeping the blue gradient for CanstarBlue
			},
		},
		fontFamily: '"Open Sans", sans-serif',
		borderRadius: '8px',
		logo: {
			text: 'CANSTAR BLUE',
			color: '#1899d6',
			textColor: '#fff',
			imageUrl: 'https://www.canstarblue.com.au/wp-content/themes/canstar-blue/dist/images/logo.png',
		},
		footerColor: '#212121',
	},
};

export default themes;

