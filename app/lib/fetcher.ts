// really bad but enough for now
export default async function fetcher(url: string) {
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
}
