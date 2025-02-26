import type { NextRequest } from 'next/server';

export type ServerStatus = {
	connection_info: string;
	gamestate: number;
	map: string;
	name: string;
	players: number;
	round_duration: number;
	round_id: number;
	security_level: string;
	server_status: number;
	err_str?: string;
};

export type Player = {
	ckey: string;
	byond_key: string;
	first_seen: string;
	last_seen: string;
	first_seen_round: number;
	last_seen_round: number;
	byond_age: string;
	characters: [string, number][];
	roletime: { job: string; minutes: number }[];
	activity: [string, number][];
	bans: {
		bantime: string;
		round_id: number | null;
		roles: string | null;
		expiration_time: string | null;
		reason: string;
		ckey: string | null;
		a_ckey: string;
		unbanned_datetime: string | null;
		unbanned_ckey: string | null;
	}[];
} | null;

export type Death = {
	name: string;
	job: string;
	pod: string;
	bruteloss: number;
	fireloss: number;
	oxyloss: number;
	toxloss: number;
	last_words: string | null;
	suicide: boolean;
	round_id: number | null;
    tod: string;
};

export type StatisticDatas = {
	data: Death[] | Citation[];
	total_count: number;
} | null;

export type Citation = {
	sender: string;
	recipient: string;
	crime: string;
	fine: number | null;
	timestamp: string;
	round_id: number | null;
};

export type ChartData = {
	round_id: number;
	threat_level: number;
	citations: number;
	deaths: number;
	readyed_players: number;
	total_players: number;
	round_duration: number;
};

export interface Middleware {
	matcher: string[];
	condition: (request: NextRequest) => boolean;
	action: (request: NextRequest) => Response | void;
}
