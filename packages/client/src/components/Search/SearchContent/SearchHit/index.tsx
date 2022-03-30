import React, { useContext, useRef, useState } from 'react';

import type { SearchRecord } from '@/components/Search/hooks';

import SvgIcon from '@/components/Icon';
import * as S from '@/components/Search/SearchContent/SearchHit/styles';
import { SearchContext } from '@/components/Search/SearchContext';
import { onEnterKeyPressed } from '@/utils';

interface SearchHitProps {
	record: SearchRecord;
}

export function SearchHit({ record }: SearchHitProps) {
	const [isFocused, setIsFocused] = useState(false);
	const { setIsOpen, appendToHistory } = useContext(SearchContext);

	function handleClick() {
		appendToHistory(record);
		setIsOpen(false);
	}

	function handleKeypress() {
		// this event will propagate up to and invoke `handleClick`
		ref.current?.click();
	}

	function handleFocus() {
		setIsFocused(true);
	}

	function handleBlur() {
		setIsFocused(false);
	}

	const id = `search-hit-${record.id}`;
	const ref = useRef<HTMLAnchorElement>(null);

	return (
		<S.SearchHit
			data-testid={id}
			id={id}
			isFocused={isFocused}
			onClick={handleClick}
			onKeyPress={onEnterKeyPressed(handleKeypress)}
			tabIndex={-1}
			onFocus={handleFocus}
			onBlur={handleBlur}
		>
			<S.StyledHashLink smooth to={record.link} ref={ref}>
				<S.SearchHitContainer>
					<S.SearchHitIcon>
						<SvgIcon name="hash" size={12} />
					</S.SearchHitIcon>

					<S.SearchHitContent>
						{record.category === 'message' ? (
							<S.SearchHitTitle
								dangerouslySetInnerHTML={{ __html: record.label }}
							/>
						) : (
							<S.SearchHitTitle>{record.label}</S.SearchHitTitle>
						)}
					</S.SearchHitContent>

					<S.SearchHitAction>
						<SvgIcon color="#fff" name="arrow-right" size={23} />
					</S.SearchHitAction>
				</S.SearchHitContainer>
			</S.StyledHashLink>
		</S.SearchHit>
	);
}

SearchHit.displayName = 'SearchHit';
