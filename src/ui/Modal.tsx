import React from 'react';
import ReactModal from 'react-modal';

import type { FC, KeyboardEvent } from 'react';

import { CloseIconButton } from './CloseIconButton';

const modalStyles = {
	default: {
		overlay: {
			backgroundColor: 'rgba(0, 0, 0, 0.8)',
			zIndex: 1000
		},
		content: {
			top: '50%',
			left: '50%',
			right: 'auto',
			bottom: 'auto',
			marginRight: '-50%',
			borderRadius: 8,
			padding: '40px 40px 40px 40px',
			transform: 'translate(-50%, -50%)',
			backgroundColor: 'var(--color-primary-800)',
			border: 'none',
			maxHeight: '80vh',
			width: '90%',
			maxWidth: 530
		}
	},
	userPreview: {
		overlay: {
			backgroundColor: 'rgba(0, 0, 0, 0.8)',
			zIndex: 1000
		},
		content: {
			top: '50%',
			left: '50%',
			right: 'auto',
			bottom: 'auto',
			marginRight: '-50%',
			borderRadius: 8,
			padding: 0,
			transform: 'translate(-50%, -50%)',
			backgroundColor: 'var(--color-primary-900)',
			border: 'none',
			maxHeight: '80vh',
			width: '90%',
			maxWidth: 435
		}
	}
};

export const Modal: FC<
ReactModal['props'] & { variant?: keyof typeof modalStyles }
> = ({ children, variant = 'default', ...props }) => {
	const onKeyDown = (event: KeyboardEvent) => {
		const currentActive = document.activeElement;

		if (event.key === 'ArrowLeft') {
			(currentActive?.previousElementSibling as HTMLElement)?.focus();
		} else if (event.key === 'ArrowRight') {
			(currentActive?.nextElementSibling as HTMLElement)?.focus();
		}
	};

	return (
		<ReactModal
			shouldCloseOnEsc
			shouldFocusAfterRender
			style={modalStyles[variant]}
			{...props}
		>
			<div className={'flex flex-col w-full'}>
				<div className={'flex justify-end absolute right-3 top-3'}>
					<button
						className={'p-1 text-primary-100'}
						onClick={(e) => props?.onRequestClose?.(e)}
						data-testid="close-modal"
					>
						<CloseIconButton className={'transform rotate-45'} />
					</button>
				</div>
				<div
					tabIndex={-1}
					className={'focus:outline-none'}
					onKeyDown={onKeyDown}
					role="tab"
				>
					{children}
				</div>
			</div>
		</ReactModal>
	);
};

Modal.displayName = 'Modal';
