import { ERROR_MESSAGES } from '@uxc/common/node'
import { UserInputError } from 'apollo-server-core'
import { isValidObjectId } from 'mongoose'

import { User } from '@/db'

import type { Resolver } from '../types'
import type { ObjectID, User as UserType } from '@uxc/common/node'

export const getUser: Resolver<UserType, { userId: ObjectID }> = async (
  _,
  { userId },
) => {
  if (!userId) {
    throw new UserInputError(ERROR_MESSAGES.E_NO_USER_ID)
  }

  if (!isValidObjectId(userId)) {
    throw new UserInputError(
      `The provided userId ${userId} is not a valid ObjectID.`,
    )
  }

  const user = await User.findById(userId)

  return user
}
