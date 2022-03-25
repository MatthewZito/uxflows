import { HashLink } from 'react-router-hash-link';
import styled from 'styled-components';

import { FontSizeBase, FontSizeXs } from '@/styles/Typography/FontSize';

export const ListItem = styled.li.attrs<{ isActiveRecord: boolean }>(
	({ isActiveRecord }) => ({
		'role': 'option',
		'aria-selected': isActiveRecord
	})
)<{ isActiveRecord: boolean }>`
	position: 'relative';
	background-color: ${({ theme, isActiveRecord }) =>
		isActiveRecord && theme.colors.background.hover};
	color: ${({ theme, isActiveRecord }) =>
		isActiveRecord ? theme.colors.accent.norm : theme.colors.font.strong};
	cursor: pointer;

	transition: color 0.3s, background-color 0.4s;

	&:hover {
		background-color: ${({ theme }) => theme.colors.background.hover};
	}
`;

export const StyledHashLink = styled(HashLink)`
	display: flex;
	align-items: center;
	padding: 1.25rem;
	border-color: ${({ theme }) => theme.colors.border.weak};
	text-decoration: none !important;

	&:focus-visible {
		outline: 1px solid white;
	}
`;

export const ListItemContent = styled.div`
	z-index: 1;
	display: flex;
	min-width: 0;
	flex: auto;
	flex-direction: column;
`;

export const LeftAction = styled.div`
	flex: none;
	margin-left: 0.875rem;
`;

export const RightAction = styled.div`
	padding-left: 0.75rem;
	border-color: ${({ theme }) => theme.colors.border.weak};
	border-left-width: 1px;
	margin-left: 0.75rem;
`;

export const Label = styled.span`
	${FontSizeBase}
	overflow: hidden;
	color: ${({ theme }) => theme.colors.font.weak} !important;
	line-height: 1.5rem;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

export const Badge = styled.span`
	${FontSizeXs}
	align-self: flex-start;
	padding: 0.15rem 0.375rem;
	margin-bottom: 0.5rem;
	background-color: ${({ theme }) => theme.colors.background.strong};
	border-radius: 999px;
	color: ${({ theme }) => theme.colors.font.weak};
`;

export const IconButton = styled.button`
	display: flex;
	width: 1.75rem;
	height: 1.75rem;
	align-items: center;
	justify-content: center;
`;
