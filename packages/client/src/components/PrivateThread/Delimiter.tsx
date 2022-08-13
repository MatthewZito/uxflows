import React, { forwardRef } from 'react'
import styled from 'styled-components'

import { FontSizeSm } from '@/styles/Typography/FontSize'

import SvgIcon from '../Icon'

interface DelimiterProps {
  title: string
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  color: ${({ theme }) => theme.colors.font.strong};
`

const Label = styled.p`
  ${FontSizeSm}
  font-weight: 700;
  opacity: 0.75;
  text-transform: uppercase;
  white-space: nowrap;
`

export const Delimiter = forwardRef<HTMLButtonElement, DelimiterProps>(
  ({ title }, ref) => (
    <Container>
      <Label>{title}</Label>
      <button
        data-testid="dm-btn"
        ref={ref}
        title="Create direct message"
        type="button"
      >
        <SvgIcon name="plus" size={24} />
      </button>
    </Container>
  ),
)

Delimiter.displayName = 'Delimiter'
