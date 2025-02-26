import type { Metadata } from 'next';

import { getChartData } from '@/app/lib/data';
import { openGraph, title } from '@/app/metadata';

import Statistics from '../ui/statistics';

export const metadata: Metadata = {
	title: 'İstatistikler',
	// description: null,
	openGraph: {
		...openGraph,
		title: `İstatistikler – ${title}`,
	},
};

export default async function Page() {
	const chart_data = await getChartData()

	return <Statistics chart_data={chart_data.toReversed()}/>;
}
