import type { Player } from "@/app/lib/definitions";
import headers from "@/app/lib/headers";

const revalidate = 3_600; // 1 hour

const player_url = process.env.NEXT_PUBLIC_API_URL + '/v2/player?ckey=';
const characters_url = process.env.NEXT_PUBLIC_API_URL + '/v2/player/characters?ckey=';

export async function getPlayer(ckey: string): Promise<Player> {
	const playerPromise = fetch(player_url + ckey, { headers, next: { revalidate } });
	const charactersPromise = fetch(characters_url + ckey, { headers, next: { revalidate } });

	const [playerResponse, charactersResponse] = await Promise.all([playerPromise, charactersPromise]);

	if (!playerResponse.ok || !charactersResponse.ok) {
		if (playerResponse.status === 404) {
			return null;
		}

		throw new Error('Internal API Error');
	}

	const [player, characters] = await Promise.all([playerResponse.json(), charactersResponse.json()]);

	return {
		...player,
		characters,
	};
}
