import React from 'react';

import { connector, PropsFromRedux } from '@/state';
import { onEnterKeyPressed } from '@/utils';

interface HeaderProps {
	title: string;
	className?: string;
}

function Header({
	title,
	className = '',
	showUpsertChannelModal
}: HeaderProps & PropsFromRedux) {
	const handleClick = () => {
		showUpsertChannelModal({ type: 'create' });
	};

	return (
		<div
			className={`flex justify-between items-center text-white p-2 pl-3 ${className}`}
		>
			<p className="whitespace-nowrap font-bold text-sm opacity-75 uppercase">
				{title}
			</p>

			<button
				className="btn-hover"
				onClick={handleClick}
				onKeyPress={onEnterKeyPressed(handleClick)}
				role="button"
				tabIndex={0}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="26"
					height="26"
					fill="currentColor"
					viewBox="0 0 16 16"
				>
					<path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
				</svg>
			</button>
		</div>
	);
}

Header.displayName = 'Header';

export const ConnectedHeader = connector(Header);