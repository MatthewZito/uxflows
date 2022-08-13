import { UPDATE_FRIEND_REQUEST, GET_FRIEND_REQUESTS_SENT } from '@@/fixtures'
import { join, diad, createFriendRequest, getFriends } from '@@/utils'
import { ERROR_MESSAGES } from '@uxc/common/node'
import request from 'supertest'

import { app } from '@/app'
import { seed } from '@/schema/resolvers/mutations/computed/seed'

const status = 'ACCEPTED'

const testSubject = 'updateFriendRequest'
describe(`${testSubject} workflow`, () => {
  it('fails with an Unauthorized error if the request does not include a valid session cookie', async () => {
    const { users } = await seed({ mode: 0 })

    const { body } = await request(app)
      .post(BASE_PATH)
      .send({
        query: UPDATE_FRIEND_REQUEST,
        variables: {
          recipientId: users[0]._id,
          status,
        },
      })
      .expect(200)

    expect(body.errors).toHaveLength(1)
    expect(body.errors[0].message).toStrictEqual(
      ERROR_MESSAGES.E_AUTHORIZATION_REQUIRED,
    )
    expect(body.errors[0].path[0]).toBe(testSubject)
  })

  it('fails when not provided a requestId', async () => {
    const { cookie } = await join()

    const { body } = await request(app)
      .post(BASE_PATH)
      .set('Cookie', cookie)
      .send({
        query: UPDATE_FRIEND_REQUEST,
        variables: { requestId: null, status },
      })
      .expect(200)

    expect(body.errors).toHaveLength(1)
    expect(body.errors[0].message).toStrictEqual(ERROR_MESSAGES.E_NO_REQUEST_ID)
    expect(body.errors[0].path[0]).toBe(testSubject)
  })

  it('fails when not provided a status', async () => {
    const { users } = await seed({ mode: 0 })
    const { cookie } = await join()

    const { body } = await createFriendRequest({
      cookie,
      variables: {
        recipientId: users[0]._id,
      },
    })

    const { body: body2 } = await request(app)
      .post(BASE_PATH)
      .set('Cookie', cookie)
      .send({
        query: UPDATE_FRIEND_REQUEST,
        variables: {
          requestId: body.data.createFriendRequest,
          status: null,
        },
      })
      .expect(200)

    expect(body2.errors).toHaveLength(1)
    expect(body2.errors[0].message).toStrictEqual(
      ERROR_MESSAGES.E_NO_REQUEST_STATUS,
    )
    expect(body2.errors[0].path[0]).toBe(testSubject)
  })

  it('fails when provided a requestId that is not a valid ObjectID', async () => {
    const { cookie } = await join()
    const badrequestId = 'test'

    const { body } = await request(app)
      .post(BASE_PATH)
      .set('Cookie', cookie)
      .send({
        query: UPDATE_FRIEND_REQUEST,
        variables: {
          requestId: badrequestId,
          status,
        },
      })
      .expect(200)

    expect(body.errors).toHaveLength(1)
    expect(body.errors[0].message).toStrictEqual(
      `The provided requestId ${badrequestId} is not a valid ObjectID.`,
    )
    expect(body.errors[0].path[0]).toBe(testSubject)
  })

  it('fails when provided a requestId that does not exist in the database', async () => {
    const { threadIds } = await seed({ mode: 0 })

    const { cookie } = await join()
    const threadId = threadIds[0]

    const { body } = await request(app)
      .post(BASE_PATH)
      .set('Cookie', cookie)
      .send({
        query: UPDATE_FRIEND_REQUEST,
        variables: { requestId: threadId, status },
      })
      .expect(200)

    expect(body.errors).toHaveLength(1)
    expect(body.errors[0].message).toStrictEqual(
      `The provided requestId ${threadId} does not represent a resource in the database.`,
    )
    expect(body.errors[0].path[0]).toBe(testSubject)
  })

  it('fails when the user attempts to update the status of a friend request they sent', async () => {
    const { cookie, id2 } = await diad()

    const { body } = await createFriendRequest({
      cookie,
      variables: {
        recipientId: id2,
      },
    })

    const { body: body2 } = await request(app)
      .post(BASE_PATH)
      .set('Cookie', cookie)
      .send({
        query: UPDATE_FRIEND_REQUEST,
        variables: {
          requestId: body.data.createFriendRequest,
          status,
        },
      })
      .expect(200)

    expect(body2.errors).toHaveLength(1)
    expect(body2.errors[0].message).toStrictEqual(
      ERROR_MESSAGES.E_NO_SELF_REQUEST_EDIT,
    )

    expect(body2.errors[0].path[0]).toBe(testSubject)
  })

  it('updates a friend request', async () => {
    const { cookie, cookie2, id2 } = await diad()

    const { body } = await createFriendRequest({
      cookie,
      variables: {
        recipientId: id2,
      },
    })

    const { body: body2 } = await request(app)
      .post(BASE_PATH)
      .set('Cookie', cookie2)
      .send({
        query: UPDATE_FRIEND_REQUEST,
        variables: {
          requestId: body.data.createFriendRequest,
          status,
        },
      })
      .expect(200)

    expect(body2.data.updateFriendRequest).toStrictEqual(expect.any(String))
  })

  it('deletes the friend request once its status is updated to REJECTED', async () => {
    const { cookie, cookie2, id2 } = await diad()

    const { body } = await createFriendRequest({
      cookie,
      variables: {
        recipientId: id2,
      },
    })

    const { body: body2 } = await request(app)
      .post(BASE_PATH)
      .set('Cookie', cookie2)
      .send({
        query: UPDATE_FRIEND_REQUEST,
        variables: {
          requestId: body.data.createFriendRequest,
          status: 'REJECTED',
        },
      })
      .expect(200)

    expect(body2.data.updateFriendRequest).toStrictEqual(expect.any(String))

    const { body: body3 } = await request(app)
      .post(BASE_PATH)
      .set('Cookie', cookie)
      .send({
        query: GET_FRIEND_REQUESTS_SENT,
        variables: {
          type: 'SENT',
        },
      })
      .expect(200)

    expect(body3.data.getFriendRequests).toHaveLength(0)
  })

  it('deletes the friend request once its status is updated to ACCEPTED and creates a new Friend relationship', async () => {
    const { cookie, cookie2, id2 } = await diad()

    const { body } = await createFriendRequest({
      cookie,
      variables: {
        recipientId: id2,
      },
    })

    const { body: body2 } = await getFriends({ cookie })

    expect(body2.data.getFriends).toHaveLength(0)

    const { body: body3 } = await request(app)
      .post(BASE_PATH)
      .set('Cookie', cookie2)
      .send({
        query: UPDATE_FRIEND_REQUEST,
        variables: {
          requestId: body.data.createFriendRequest,
          status: 'ACCEPTED',
        },
      })
      .expect(200)

    expect(body3.data.updateFriendRequest).toStrictEqual(expect.any(String))

    const { body: body4 } = await request(app)
      .post(BASE_PATH)
      .set('Cookie', cookie)
      .send({
        query: GET_FRIEND_REQUESTS_SENT,
        variables: {
          type: 'SENT',
        },
      })
      .expect(200)

    expect(body4.data.getFriendRequests).toHaveLength(0)

    const { body: body5 } = await getFriends({ cookie })

    expect(body5.data.getFriends).toHaveLength(1)
  })
})
