import type { NextRequest } from 'next/server';

import players from '@/app/middleware/players';

const middlewares = [players];

// there is a reason why it's not `middlewares.flatMap((m) => m.matcher)`
// have to be able to statically parsed at compiled-time
// so need to add entries manually
export const config = {
	matcher: ['/players/:ckey*'],
};

export function middleware(request: NextRequest) {
	let response: Response | undefined;
	for (const m of middlewares) {
		if (m.condition(request)) {
			const r = m.action(request);
			if (r) {
				response = r;
			}
		}
	}
	return response;
}
