import type { NextRequest } from "next/server";

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
} | null;

export interface Middleware {
	matcher: string[];
	condition: (request: NextRequest) => boolean;
	action: (request: NextRequest) => Response | void;
}
