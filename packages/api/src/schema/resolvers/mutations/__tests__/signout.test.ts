import { SIGNOUT_MUTATION } from '@@/fixtures'
import { join } from '@@/utils'
import request from 'supertest'

import { app } from '@/app'

import { seed } from '../computed'

describe('signout workflow', () => {
  it('clears the cookie after logging out', async () => {
    const { cookie } = await join()
    await seed()

    const response = await request(app)
      .post(globalThis.BASE_PATH)
      .set('Cookie', cookie)
      .send({
        query: SIGNOUT_MUTATION,
      })
      .expect(200)

    expect(response.get('Set-Cookie')).toBeUndefined()
  })
})
