import { UserInputError } from 'apollo-server-core'

import { PrivateThread } from '@/db'

import type { Resolver } from '../types'
import type {
  ObjectID,
  PrivateThread as PrivateThreadType,
} from '@uxc/common/node'

/**
 * @todo Paginate.
 * @todo Test; assert only friend threads by default.
 */
export const getThreads: Resolver<PrivateThreadType[], { userId: ObjectID }> =
  async (_, { userId }) => {
    if (!userId) {
      throw new UserInputError('todo')
    }

    const privateThreads = await PrivateThread.findUserThreads(userId)

    return privateThreads
  }
