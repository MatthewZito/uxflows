import { ERROR_MESSAGES } from '@uxc/common/node'
import { UserInputError } from 'apollo-server-core'
import { isValidObjectId } from 'mongoose'

import { PrivateThread } from '@/db'

import type { Resolver } from '../types'
import type {
  ObjectID,
  User,
  PrivateThread as PrivateThreadType,
} from '@uxc/common/node'

export const getThread: Resolver<
  PrivateThreadType & { users: User[] },
  { threadId: ObjectID }
> = async (_, { threadId }) => {
  if (!threadId) {
    throw new UserInputError(ERROR_MESSAGES.E_NO_THREAD_ID)
  }

  if (!isValidObjectId(threadId)) {
    throw new UserInputError(
      `The provided threadId ${threadId} is not a valid ObjectID.`,
    )
  }

  const thread = await PrivateThread.findById(threadId).populate('users')

  return thread
}
