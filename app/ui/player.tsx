'use client';

import { useEffect } from 'react';

import type { Player } from '@/app/lib/definitions';
import Button from '@/app/ui/button';

type Props = {
	player: NonNullable<Player>;
};

export default function Player({ player }: Props) {
	useEffect(() => {
		document.getElementById('navigation')?.scrollIntoView({ behavior: 'smooth' });
	}, []);

	return (
		<div className="flex-1 flex flex-col items-center gap-5">
			{/* Basic Info */}
			<div className="flex flex-col items-center gap-3">
				<span className="text-center text-5xl font-bold">{player.byond_key}</span>
				<span>İlk Görülen Round: {player.first_seen_round}</span>
				<span>Son Görülen Round: {player.last_seen_round}</span>
				<span>İlk Görülen Tarih: {player.first_seen}</span>
				<span>Son Görülen Tarih: {player.last_seen}</span>
				<span>BYOND&apos;a Katıldığı Tarih: {player.byond_age}</span>
			</div>
			{/* Activity */}
			<div className="flex flex-col items-center gap-3">
				<span className="text-center text-3xl font-bold">Aktivite</span>
				<div className="flex flex-wrap gap-4 justify-center px-8 py-6 sm:px-14 md:px-18 xl:px-60">
					{/* Todo: Graph */}
					—
				</div>
			</div>
			{/* Roletimes */}
			<div className="flex flex-col items-center gap-3">
				<span className="text-center text-3xl font-bold">Roller</span>
				<div className="flex flex-wrap gap-4 justify-center px-8 py-6 sm:px-14 md:px-18 xl:px-60">
					{/* Todo: Graph */}
					—
				</div>
			</div>
			{/* Characters */}
			<div className="flex flex-col items-center gap-3">
				<span className="text-center text-3xl font-bold">Karakterler</span>
				<div className="flex flex-wrap justify-center gap-4 px-2 py-6 sm:px-14 md:px-18 xl:px-60">
					{player.characters.length ? player.characters.map(([character]) => (
						<Button key={character}>{character}</Button>
					)) : (
						<span>Hiçbir karakter bulunamadı.</span>
					)}
				</div>
			</div>
		</div>
	);
}
