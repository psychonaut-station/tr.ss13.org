import './globals.css';

import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Image from 'next/image';

import background from '@/app/images/background.png';
import NavLinks from '@/app/ui/nav-links';

const geistSans = localFont({
	src: './fonts/GeistVF.woff',
	variable: '--font-geist-sans',
});
const geistMono = localFont({
	src: './fonts/GeistMonoVF.woff',
	variable: '--font-geist-mono',
});

export const metadata: Metadata = {
	title: {
		template: '%s – Psychonaut Station',
		default: 'Psychonaut Station',
	},
	description: "Psychonaut Station'a hoş geldin",
};

type RootLayoutProps = { children: React.ReactNode };

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<html lang="tr">
			<body className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
				<div className="w-screen h-screen flex flex-col overflow-x-hidden scrollbar-thumb-gray scrollbar-track-transparent">
					<NavLinks />
					{children}
				</div>
				<div className="w-screen h-screen fixed top-0 left-0 -z-50 pointer-events-none">
					<Image className="w-full h-full object-cover object-left-top" src={background} alt="Website background" quality={100} priority />
				</div>
			</body>
		</html>
	);
}
