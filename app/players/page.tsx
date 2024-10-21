import type { Metadata } from "next";

import { openGraph, title } from '@/app/metadata';
import PlayerSearch from "@/app/ui/player-search";

export const metadata: Metadata = {
	title: 'Oyuncular',
	// description: null,
	openGraph: {
		...openGraph,
		title: `Oyuncular – ${title}`,
	},
};

export default function Page() {
	return <PlayerSearch />;
}
