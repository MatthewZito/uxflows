import { ERROR_MESSAGES } from '@uxc/common/node'
import { AuthenticationError } from 'apollo-server-core'

import { User } from '@/db'

import type { Resolver } from '../types'
import type { User as UserType } from '@uxc/common/node'

export const getCurrentUser: Resolver<UserType> = async (_, __, { req }) => {
  const userId = req.session.meta?.id
  if (!userId) {
    throw new AuthenticationError(ERROR_MESSAGES.E_NO_USER_SESSION)
  }

  const user = await User.findById(userId)

  return user
}
