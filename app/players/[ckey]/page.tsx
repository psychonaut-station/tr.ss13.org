import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getPlayer } from '@/app/lib/data';
import Player from '@/app/ui/player';

type Props = {
	params: {
		ckey: string;
	};
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const player = await getPlayer(params.ckey);

	return {
		title: player ? player.byond_key : '404',
	};
}

export default async function Page({ params }: Props) {
	const player = await getPlayer(params.ckey);

	if (!player) {
		notFound();
	}

	return <Player player={player} />;
}
