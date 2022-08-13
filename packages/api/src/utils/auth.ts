import { scrypt, randomBytes } from 'crypto'
import { promisify } from 'util'

import { logger } from '@/services/logger'

import { sign } from './jwt'

import type { ObjectID } from '@uxc/common/node'
import type { Request } from 'express'

const scryptAsync = promisify(scrypt)

export async function toHash(password: string) {
  const salt = randomBytes(8).toString('hex')
  const buffer = await scryptAsync(password, salt, 64)

  return `${buffer.toString('hex')}.${salt}`
}

export async function compare(stored: string, given: string) {
  const [hashed, salt] = stored.split('.')
  const buffer = await scryptAsync(given, salt, 64)

  return buffer.toString('hex') === hashed
}

export function createSession(id: ObjectID) {
  const accessToken = sign({ id })
  const refreshToken = sign({ id, isRefresh: true })

  return {
    accessToken,
    refreshToken,
  }
}

export function invalidateSession(req: Request) {
  req.session.destroy(ex => {
    if (ex) {
      logger.error('An error occurred in `invalidateSession`. see: ', ex)
    }
  })
}
