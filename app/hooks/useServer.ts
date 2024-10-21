import useSWR from 'swr';

import type { ServerStatus } from '@/app//lib/definitions';

// really bad but enough for now
const fetcher = async (url: string) => {
	// if this fails, it will throw an error which would be good to show to the user directly
	const response = await fetch(url);

	if (response.status === 500) {
		throw new Error('Internal API Error');
	} else if (response.status === 404) {
		throw new Error('Not Found');
	} else if (!response.ok) {
		throw new Error('An error occurred');
	}

	try {
		return response.json();
	} catch {
		return response.text();
	}
};

const url = 'https://api.turkb.us/v2/server';

export default function useServer() {
	const { data, error, isLoading } = useSWR<ServerStatus[]>(url, fetcher, {
		refreshInterval: 30_000,
		refreshWhenHidden: true,
		revalidateOnFocus: false,
	});

	return {
		servers: data,
		error,
		isLoading,
	};
}
