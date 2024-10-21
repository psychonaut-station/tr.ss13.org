import type { Metadata } from "next";

export const title = 'Psychonaut Station';

// eport const description = `${title}'a hoş geldin. Space Station 13 açık kaynak kodlu,
// 	topluluk odaklı çok oyunculu bir simülasyon oyunudur. Gelecekte geçen oyunda, bir uzay
// 	istasyonunda barmenden mühendise, hademeden bilim adamına ve hatta kaptana kadar değişen
// 	bir rol oynuyorsunuz. Tüm bunlar siz bir düşman tarafından öldürülmemeye çalışırken gerçekleşiyor!`
// .replaceAll('\n\t', '');

export const description = `${title}'a hoş geldin.`;

const keywords = [title, 'SS13', 'Space Station 13'];

const url = process.env.PRODUCTION_URL;

export const openGraph: Metadata['openGraph'] = {
	title,
	siteName: title,
	locale: 'tr_TR',
	type: 'website',
};

export const metadata: Metadata = {
	metadataBase: url ? new URL(url) : undefined,
	title: {
		template: `%s – ${title}`,
		default: title,
	},
	keywords,
	openGraph,
};
