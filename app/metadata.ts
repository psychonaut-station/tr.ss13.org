import type { Metadata } from "next";

export const metadata: Metadata = {
	metadataBase: new URL('https://turkb.us'),
	title: {
		template: '%s – Psychonaut Station',
		default: 'Psychonaut Station',
	},
	description: "Psychonaut Station'a hoş geldin",
	keywords: ['Psychonaut Station', 'SS13', 'Space Station 13'],
	openGraph: {
		title: 'Psychonaut Station',
		description: "Psychonaut Station'a hoş geldin",
		url: 'https://turkb.us',
		siteName: 'Psychonaut Station',
		locale: 'tr_TR',
		type: 'website',
	}
};
