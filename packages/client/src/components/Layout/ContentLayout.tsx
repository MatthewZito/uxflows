import { useQuery } from '@apollo/client'
import React, { useContext } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import styled from 'styled-components'

import { ConnectedChatRoom as ChatRoom } from '@/components/ChatRoom'
import { Friends } from '@/components/Friends'
import { FriendsHeader } from '@/components/Friends/FriendsHeader'
import SvgIcon from '@/components/Icon'
import { GET_CURRENT_USER } from '@/services/api/queries'
import { ThreadsContext } from '@/state/context/ThreadsContext'
import { FlexCol } from '@/styles/Layout'
import { FontSizeXl } from '@/styles/Typography/FontSize'

import { FriendsProvider } from '../Friends/FriendsContext'
import { ConfirmModal } from '../Modal/Confirm/ConfirmModal'
import { ConfirmModalProvider } from '../Modal/Confirm/ConfirmModalContext'

import type { User } from '@uxc/common'

const Container = styled.div`
  ${FlexCol}
  width: 100%;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background.weak};
  color: ${({ theme }) => theme.colors.font.strong};
`

const Header = styled.header`
  display: flex;
  width: 100%;
  height: 65px;
  min-height: 65px;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.norm};
  border-left: 1px solid ${({ theme }) => theme.colors.border.norm};
  gap: 0.5rem;
`

const HeaderLabel = styled.p`
  ${FontSizeXl}
  font-weight: 700;
`

const ContentContainer = styled.div`
  display: flex;
  overflow: hidden;
  width: 100%;
  height: 100%;
  justify-content: center;
  border-left: 1px solid ${({ theme }) => theme.colors.border.norm};
  background-color: ${({ theme }) => theme.colors.background.norm};
  border-radius: 4px;
`

const ItemPadding = `1rem`
const Item = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  padding: ${ItemPadding};
  border-right: 1px solid ${({ theme }) => theme.colors.border.norm};

  & > svg {
    margin-right: ${ItemPadding};
  }
`

const FriendsContentContainer = styled(ContentContainer)`
  overflow-y: auto;
`

// @todo relocate
function FriendsC() {
  return (
    <FriendsProvider>
      <Container>
        <Header>
          <FriendsHeader />
        </Header>

        <FriendsContentContainer>
          <Friends />
        </FriendsContentContainer>
      </Container>
    </FriendsProvider>
  )
}

// @todo relocate
function ThreadC({ username }: { username: string }) {
  const location = useLocation()
  const paths = location.pathname.split('/')
  const threadId = paths[paths.length - 1]

  return (
    <Container
      aria-labelledby={`thread-${threadId}`}
      id={`chat-${threadId}`}
      role="tabpanel"
    >
      <Header>
        <Item>
          <SvgIcon name="people" size={21} />
          <HeaderLabel>{username}</HeaderLabel>
        </Item>
      </Header>

      <ContentContainer>
        <ChatRoom />
      </ContentContainer>
    </Container>
  )
}

export function ContentLayout() {
  const location = useLocation()
  const paths = location.pathname.split('/')
  const threadId = paths[paths.length - 1]

  const { getThreadById } = useContext(ThreadsContext)
  const { data: user } = useQuery<{
    getCurrentUser: User
  }>(GET_CURRENT_USER)

  const thread = getThreadById(threadId)

  const them = thread?.users.find(({ _id }) => _id !== user?.getCurrentUser._id)

  return (
    <ConfirmModalProvider>
      <>
        <Routes>
          <Route element={<FriendsC />} path="/" />
          <Route
            element={<ThreadC username={them?.username || ''} />}
            path="/:threadId"
          />
        </Routes>

        <ConfirmModal />
      </>
    </ConfirmModalProvider>
  )
}
