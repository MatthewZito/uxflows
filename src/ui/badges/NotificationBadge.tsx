import React from 'react';

import type { FC } from 'react';

interface INotificationBadgeProps {
	type?: 'sm' | 'md' | 'lg';
}
export const NotificationBadge: FC<INotificationBadgeProps> = ({
	children,
	type = 'md'
}) => {
	const className =
		`bg-accent rounded-full ${
			type === 'sm' ?
				'inline-block w-2 h-2 mr-2' :
				type === 'lg' ?
					'inline-flex items-center justify-center px-2 py-1 mr-2 text-xs font-bold leading-none' :
					'inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none'}`;

	return <span className={className}>{children}</span>;
};
