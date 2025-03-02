'use client';

import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, TooltipProps, XAxis, YAxis } from 'recharts';
import useSWRImmutable from 'swr/immutable';

import useResize from '@/app/hooks/useResize';
import { Citation, Death, OverviewData } from '@/app/lib/definitions';
import fetcher from '@/app/lib/fetcher';
import { minutesToHours } from '@/app/lib/time';

export default function Statistics({ statistics }: { statistics: OverviewData[] }) {
	return (
		<div className="w-full flex-1 flex flex-col items-center gap-5 px-2 pt-8 pb-14 sm:px-14 lg:px-[13.5rem]">
			<div className="w-full flex flex-col items-center gap-5">
				<span className="text-center text-3xl font-bold mb-4">Genel Bakış</span>
				<Overview overview={statistics}/>
			</div>
			<div className="w-full flex flex-col items-center gap-5">
				<span className="text-center text-3xl font-bold mb-4">Olaylar</span>
				<Events />
			</div>
		</div>
	);
}

const overview_categories = {
	players: 'Oyuncular',
	duration: 'Round Süresi',
	threat_level: 'Tehdit',
	deaths: 'Ölümler',
	citations: 'Para Cezaları',
};

type OverviewCategory = keyof typeof overview_categories;

function Overview({ overview }: { overview: OverviewData[] }) {
	const [chartWidth, setChartWidth] = useState(800);
	const chartRef = useRef<HTMLDivElement>(null);

	const [selectedCategory, setSelectedCategory] = useState<OverviewCategory>('players');
	const [nightHours, setNightHours] = useState(false);

	const filtered = useMemo(() => overview.filter((round) => {
		if (!nightHours) {
			const time = new Date(`${round.time} GMT+0`);
			const hours = time.getUTCHours();
			// 12:00 - 00:00 GMT+3
			if (!(hours >= 9 && hours < 21)) return false;
		}

		return round.duration > 10;
	}).sort((a, b) => a.round_id - b.round_id), [overview, nightHours]);

	// workaround for line animation on category change otherwise it doesn't animate
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const animated = useMemo(() => Array.from(filtered), [filtered, selectedCategory]);

	useResize((entries) => {
		const { width } = entries[0].contentRect;
		setChartWidth(width);
	}, chartRef);

	return (
		<div className="w-full flex flex-col sm:flex-row">
			<div className="max-sm:w-full h-min flex flex-col">
				<div className="max-sm:w-full h-min p-4 bg-gray-700 bg-opacity-10 rounded-xl">
					<h2 className="mb-4 text-white text-lg font-bold text-center sm:text-base">Kategoriler</h2>
					<ul className="space-y-2 [&>li]:px-4 [&>li]:py-2">
						{Object.entries(overview_categories).map(([category, name]) => (
							<li key={category} className={`${selectedCategory === category && 'bg-gray-500'} text-center cursor-pointer rounded-lg text-white hover:bg-gray-500 transition-colors text-nowrap`} onClick={() => setSelectedCategory(category as OverviewCategory)}>{name}</li>
						))}
					</ul>
				</div>
				<span className="py-2 text-center" title="00:00 ile 12:00 arası">
					<input type="checkbox" checked={nightHours} onChange={(e) => setNightHours(e.target.checked)} />
					&nbsp;Gece saatleri
				</span>
			</div>
			<div className="max-sm:w-full sm:flex-1 rounded-xl">
				<div className="w-full flex justify-center">
					<ResponsiveContainer ref={chartRef} width="100%" height={400}>
						<LineChart width={chartWidth} height={400} data={animated} margin={{ top: 5, right: 50, left: 0, bottom: 5 }}>
							<XAxis dataKey="round_id" padding={{ left: 5, right: 5 }} />
							<YAxis padding={{ bottom: 5 }} allowDecimals={false} />
							<Tooltip
								cursor={{ opacity: 0.1 }}
								contentStyle={{ background: 'transparent', border: 'none' }}
								itemStyle={{ color: 'rgb(186 186 186)' }}
								content={<OverviewTooltip category={selectedCategory} />}
							/>
							<Line dataKey={selectedCategory} dot={false} type="monotone" />
							{selectedCategory === 'players' && (
								<Line dataKey="readied_players" dot={false} type="monotone" stroke="#fcdf76" />
							)}
						</LineChart>
					</ResponsiveContainer>
				</div>
			</div>
		</div>
	);
}

function OverviewTooltip({ active, payload, label, category }: TooltipProps<number, string> & { category: OverviewCategory; }) {
	if (active && payload && payload.length) {
		switch (category) {
			case 'players':
				return (
					<div className="[&>p]:text-center [&>p]:text-gray-100 [&>p:last-child]:text-gray-400 [&>p:last-child]:text-sm">
						<p>Toplam: {payload[0].value} kişi</p>
						<p>Ready: {payload[1]?.value ?? '0'} kişi</p>
						<p>{`Round ${label}`}</p>
					</div>
				);
			case 'duration':
				return (
					<div className="[&>p]:text-center [&>p]:text-gray-100 [&>p:last-child]:text-gray-400 [&>p:last-child]:text-sm">
						<p>{minutesToHours(payload[0].value ?? 0)}</p>
						<p>{`Round ${label}`}</p>
					</div>
				);
			case 'deaths':
			case 'citations':
				return (
					<div className="[&>p]:text-center [&>p]:text-gray-100 [&>p:last-child]:text-gray-400 [&>p:last-child]:text-sm">
						<p>{payload[0].value} {category === 'deaths' ? 'ölüm' : 'ceza'}</p>
						<p>{`Round ${label}`}</p>
					</div>
				);
			default:
				return (
					<div className="[&>p]:text-center [&>p]:text-gray-100 [&>p:last-child]:text-gray-400 [&>p:last-child]:text-sm">
						<p>{payload[0].value}</p>
						<p>{`Round ${label}`}</p>
					</div>
				);
		}
	}

	return null;
}

const event_categories = {
	deaths: 'Ölümler',
	citations: 'Para Cezaları',
};
const pageSizeOptions = [10, 20, 30, 40] as const;

function Events() {
	const [selectedCategory, setSelectedCategory] = useState<keyof typeof event_categories>('deaths');

	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState<(typeof pageSizeOptions)[number]>(20);
	const [items, setItems] = useState<(Citation | Death)[]>([]);
	const [paginatedItems, setPaginatedItems] = useState<(Citation | Death)[]>([]);
	const [totalPages, setTotalPages] = useState(1);

	useEffect(() => {
		setItems([]);
		setCurrentPage(1);
		setTotalPages(1);
	}, [pageSize, selectedCategory]);

	const blockIndex = Math.ceil(currentPage / 2);
	const fetchSize = pageSize * 2;

	const { data, error, isLoading } = useSWRImmutable<{ data: Death[] | Citation[]; total_count: number; }>(`/api/events/${selectedCategory}?page=${blockIndex}&fetch_size=${fetchSize}`, fetcher);

	useEffect(() => {
		if (data) {
			setItems(data.data);
			setTotalPages(Math.ceil(data.total_count / pageSize));
		}
	}, [data, pageSize]);

	useEffect(() => {
		const blockPage = Math.ceil(currentPage / 2);
		const pageInBlock = currentPage - (blockPage - 1) * 2;
		const startIndex = (pageInBlock - 1) * pageSize;
		const endIndex = startIndex + pageSize;
		setPaginatedItems(items.slice(startIndex, endIndex));
	}, [items, currentPage, pageSize]);

	return (
		<div className="w-full flex flex-col sm:flex-row sm:space-x-4">
			<div className="max-sm:w-full h-min p-4 mb-4 sm:mb-0 bg-gray-700 bg-opacity-10 rounded-xl">
				<h2 className="mb-4 text-white text-lg font-bold text-center sm:text-base">Kategoriler</h2>
				<ul className="space-y-2 [&>li]:px-4 [&>li]:py-2">
					{Object.entries(event_categories).map(([category, name]) => (
						<li key={category} className={`${selectedCategory === category && 'bg-gray-500'} text-center cursor-pointer rounded-lg text-white hover:bg-gray-500 transition-colors text-nowrap`} onClick={() => setSelectedCategory(category as keyof typeof event_categories)}>{name}</li>
					))}
				</ul>
			</div>
			<div className="max-sm:w-full sm:flex-1 bg-gray px-4 rounded-xl">
				{isLoading && !data && !error && (
					<div className="w-full flex items-center justify-center">
						<div className="w-12 h-12 flex items-center justify-center opacity-50">
							<Icon icon={faSpinner} size="3x" spin />
						</div>
					</div>
				)}
				<ul>
					{paginatedItems.map((item, index) => <Event key={index} item={item} />)}
				</ul>
				{error && (
					<div className="w-full flex items-center justify-center">
						<span className="text-red-500">An error has occurred: {error.message}</span>
					</div>
				)}
				<div className="flex justify-between items-center mt-4">
					<div>
						<label className="text-white mr-2">Sayfa Boyutu:</label>
						<select className="p-2 bg-gray-700 text-white rounded-md" value={pageSize} onChange={(e) => setPageSize(closest(Number(e.target.value), pageSizeOptions as any) as (typeof pageSizeOptions)[number])}>
							{pageSizeOptions.map(size => <option key={size} value={size}>{size}</option>)}
						</select>
					</div>
					<div className="flex flex-row gap-2 items-center justify-center">
						<button className="px-3 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50 text-sm sm:text-base transition-opacity" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>Önceki</button>
						<span className="flex items-center justify-center text-sm sm:text-base">{currentPage} / {totalPages}</span>
						<button className="px-3 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50 text-sm sm:text-base transition-opacity" disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>Sonraki</button>
					</div>
				</div>
			</div>
		</div>
	);
}

function Event({ item }: { item: Death | Citation }) {
	if ('name' in item) {
		return (
			<li className="p-4 mb-4 bg-gray-600 bg-opacity-10 text-white rounded-lg">
				<div className="w-full flex flex-col">
					<div className="inline">
						<span className="mr-1 font-bold text-xl">{item.name}</span><span className="text-gray-400 text-sm">has died at <span className="text-gray-300">{item.pod}</span> as <span className="text-gray-300">{item.job}</span></span>
					</div>
					{item.last_words && <span className="text-gray-400 text-sm mt-1">&quot;{item.last_words}&quot;</span>}
					<div className="w-full mt-2 flex justify-between">
						<div className="flex flex-wrap gap-2">
							<div className="border border-red-300 text-red-300 px-2 py-1 rounded-md text-xs">Round {item.round_id}</div>
							{item.suicide && <div className="border border-purple-300 text-purple-300 px-2 py-1 rounded-md text-xs">İntihar</div>}
						</div>
						<div className="flex items-center gap-2 [&>span]:text-sm">
							<span title="Brute" className="text-red-500">{item.bruteloss}</span>
							<span title="Burn" className="text-orange-500">{item.fireloss}</span>
							<span title="Oxygen" className="text-blue-500">{item.oxyloss}</span>
							<span title="Toxin" className="text-green-500">{item.toxloss}</span>
						</div>
					</div>
				</div>
			</li>
		);
	}

	if ('sender' in item) {
		return (
			<li className="p-4 mb-4 bg-gray-600 bg-opacity-10 text-white rounded-lg">
				<div className="w-full flex flex-col">
					<div className="inline">
						<span className="mr-1 font-bold text-xl">{item.recipient}</span><span className="text-gray-400 text-sm">fined by <span className="text-gray-300">{item.sender}</span> for <span className="text-gray-300">{item.fine}cr</span></span>
					</div>
					<span className="text-gray-400 text-sm mt-1">{item.crime}</span>
					<div className="w-full mt-2 flex">
						<div className="flex flex-wrap">
							<div className="border border-red-300 text-red-300 px-2 py-1 rounded-md text-xs">Round {item.round_id}</div>
						</div>
					</div>
				</div>
			</li>
		);
	}

	return null;
}

function closest(num: number, opts: number[]) {
	return opts.reduce((prev, curr) => Math.abs(curr - num) < Math.abs(prev - num) ? curr : prev);
}
