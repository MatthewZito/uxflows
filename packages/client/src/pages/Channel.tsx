import React from 'react';

import { ConnectedCreateChannelModal } from '@/components/Modal/CreateChannel';
import { NotificationController } from '@/components/Notification/NotificationController';
import { ConnectedRoom } from '@/components/Room/Room';
import { ConnectedUsersInChannel } from '@/components/Room/Users/UsersInChannel';
import { Sidebar } from '@/components/Sidebar/Sidebar';
import { useViewportSize } from '@/hooks/useViewportSize';

export function Channel() {
	const viewport = useViewportSize();

	return (
		<>
			<NotificationController />

			<ConnectedCreateChannelModal />

			<div className="h-screen grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-2 lg:gap-4 p-0 lg:p-2">
				<div className="col-span-1 lg:col-span-3">
					<Sidebar />
				</div>

				<ConnectedRoom className="col-span-1 md:col-span-2 lg:col-span-6 overflow-hidden" />

				{viewport > 1 ? (
					<div className="col-span-0 col-span-3">
						<ConnectedUsersInChannel />
					</div>
				) : null}
			</div>
		</>
	);
}
