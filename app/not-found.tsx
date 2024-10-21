import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: '404',
};

export default function NotFound() {
	return (
		<div className="flex-1 flex flex-col items-center justify-end">
			<div className="flex items-center font-system">
				<span className="inline-block mr-5 pr-6 border-r border-r-white border-opacity-30 text-2xl leading-[3rem] font-medium">404</span>
				<span className="inline-block text-sm leading-[3rem]">This page could not be found.</span>
			</div>
		</div>
	);
}
