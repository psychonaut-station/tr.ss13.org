'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import type { Player } from '@/app/lib/definitions';
import Button from '@/app/ui/button';

function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max);
}

type PlayerProps = {
	player: NonNullable<Player>;
};

export default function Player({ player }: PlayerProps) {
	useEffect(() => {
		document.getElementById('navigation')?.scrollIntoView({ behavior: 'smooth' });
	}, []);

	return (
		<div className="w-full max-w-full flex-1 flex flex-col items-center gap-5">
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
			<div className="w-full flex flex-col items-center gap-3 sm:px-14 lg:px-48">
				<span className="text-center text-3xl font-bold">Rol Süreleri</span>
				{player.roletime.length ? (
					<RoletimeChart roletime={player.roletime} />
				) : (
					<div className="flex flex-wrap justify-center gap-4 px-2 py-6 sm:px-14 md:px-18 xl:px-60">
						<span>Hiçbir rol bulunamadı.</span>
					</div>
				)}
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

type RoletimeChartProps = {
	roletime: PlayerProps['player']['roletime'];
};

function RoletimeChart({ roletime }: RoletimeChartProps) {
	const [maxBars, setMaxBars] = useState(20);
	const [chartWidth, setChartWidth] = useState(800);

	const inputRef = useRef<HTMLDivElement>(null);
	const chartRef = useRef<HTMLDivElement>(null);

	const visibleRoletime = useMemo(() => roletime.slice(0, maxBars).map(({ job, minutes }) => ({ job, hours: Math.floor(minutes / 6) / 10 })), [roletime, maxBars]);

	const tooltipFormatter = useCallback((value: number) => [value.toString().replace('.', ','), ''], []);

	const onInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		setMaxBars(clamp(Number(event.target.value), 1, roletime.length));
	}, [roletime]);

	useEffect(() => {
		const preventScroll = (e: Event) => {
			if (inputRef.current && (e.target === inputRef.current || e.target === inputRef.current.firstChild!)) {
				e.preventDefault();
				e.stopPropagation();

				setMaxBars((maxBars) => clamp(maxBars + Math.sign((e as WheelEvent).deltaY) * -1, 1, roletime.length));
			}
		}

		document.body.firstChild?.addEventListener('wheel', preventScroll, { passive: false });

		return () => {
			document.body.firstChild?.removeEventListener('wheel', preventScroll);
		};
	}, [roletime]);

	useEffect(() => {
		const resizeObserver = new ResizeObserver((entries) => {
			const { width } = entries[0].contentRect;
			setChartWidth(width);
		});

		resizeObserver.observe(chartRef.current!);

		return () => {
			resizeObserver.disconnect();
		};
	}, [chartRef]);

	return (
		<>
			{/* responsive container shit does not work as documented so i had to make a state for chart width */}
			<ResponsiveContainer ref={chartRef} width="100%" height={400} style={{ position: 'relative', left: -22 }}>
				<BarChart width={chartWidth} height={400} data={visibleRoletime} margin={{ top: 5, right: 30, left: 20, bottom: 5, }}>
					<XAxis dataKey="job" />
					<YAxis />
					<Tooltip cursor={{ opacity: 0.1 }} separator="" formatter={tooltipFormatter} contentStyle={{ background: 'transparent', border: 'none' }} itemStyle={{ color: 'rgb(100 116 139)' }} />
					<Bar dataKey="hours" fill="#a81d0c" unit=" saat" />
				</BarChart>
			</ResponsiveContainer>
			<div ref={inputRef} className="flex items-center py-2 mb-8 bg-white bg-opacity-5 hover:bg-opacity-10 border border-white border-opacity-10 rounded-[.25rem] text-center">
				<input className="h-full flex-1 bg-transparent outline-none text-center" type="number" value={maxBars} min={1} max={roletime.length} onChange={onInputChange}></input>
			</div>
		</>
	);
}
