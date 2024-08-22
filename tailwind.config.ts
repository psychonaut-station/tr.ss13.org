import type { Config } from 'tailwindcss';

const config: Config = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				background: 'var(--background)',
				foreground: 'var(--foreground)',
			},
			fontFamily: {
				sans: ['var(--font-geist-sans)'],
				mono: ['var(--font-geist-mono)'],
			},
			boxShadow: {
				glow: '0 0 10px var(--tw-shadow-color)',
			},
		},
	},
	plugins: [],
};
export default config;
