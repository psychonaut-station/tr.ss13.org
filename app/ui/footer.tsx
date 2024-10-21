import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faServer } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { Fragment } from 'react';

const links = [
	{ href: '/github', icon: faGithub, label: 'GitHub' },
	{ href: '/status', icon: faServer, label: 'Sunucu Durumu' },
];

export default function Footer() {
	return (
		<div className="flex w-full items-center justify-center py-4 gap-4 text-sm">
			{links.map(({ href, icon, label }, index) => (
				<Fragment key={href}>
					<Link href={href} prefetch={false} className="opacity-80 hover:opacity-100 transition-opacity" target="_blank" rel="noreferrer external" >
						<div className="flex fex-row items-center justify-center gap-1">
							<Icon icon={icon} className="w-4 text-white" />
							<span>{label}</span>
						</div>
					</Link>
					{index !== links.length - 1 && <div className="w-[1px] h-5 bg-white opacity-20"></div>}
				</Fragment>
			))}
		</div>
	);
}
