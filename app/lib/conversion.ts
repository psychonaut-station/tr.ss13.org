export function gameState(gamestate: number) {
	switch (gamestate) {
		case 0:
			return 'Lobi';
		case 1:
			return 'Lobi';
		case 2:
			return 'Başlıyor';
		case 3:
			return 'Devam ediyor';
		case 4:
			return 'Bitti';
		default:
			return '';
	}
}

export function roundDuration(seconds: number) {
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);

	const pad = (n: number) => n.toString().padStart(2, '0');

	return `${pad(hours)}:${pad(minutes % 60)}:${pad(seconds % 60)}`;
}
