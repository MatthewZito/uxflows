import {
  USERNAME_CHARS_MAX,
  USERNAME_CHARS_MIN,
  PASSWORD_CHARS_MAX,
  PASSWORD_CHARS_MIN,
  EMAIL_CHARS_MAX,
  EMAIL_CHARS_MIN,
} from '@uxc/common/node'
import { Schema, model } from 'mongoose'

import { toHash } from '@/utils'

import type {
  AsBuildArgs,
  AsRawDocument,
  AsReturnDocument,
  UserPassword,
} from '../types'
import type { User as UserType } from '@uxc/common/node'
import type { Model } from 'mongoose'

type UserWithPassword = UserPassword & UserType
type NewUserArgs = AsBuildArgs<UserType> & UserPassword
type RawDocument = AsRawDocument<UserWithPassword>
export type ReturnDocument = AsReturnDocument<UserWithPassword>

interface UserModel extends Model<RawDocument> {
  build(attrs: NewUserArgs): ReturnDocument
}

const UserSchema = new Schema<UserWithPassword>(
  {
    email: {
      required: true,
      type: String,
      min: EMAIL_CHARS_MIN,
      max: EMAIL_CHARS_MAX,
    },
    password: {
      required: true,
      type: String,
      min: PASSWORD_CHARS_MIN,
      max: PASSWORD_CHARS_MAX,
    },
    userImage: {
      default: null,
      type: String,
    },
    username: {
      required: true,
      type: String,
      min: USERNAME_CHARS_MIN,
      max: USERNAME_CHARS_MAX,
    },
  },
  {
    timestamps: true,

    toObject: {
      transform(_, ret: RawDocument) {
        delete ret.password
        delete ret.__v
      },
    },

    // modify internal `toJSON` method to serialize the user object sans password, __v;
    // convert mongo-specific `_id` to a db-agnostic format
    toJSON: {
      // mongoose types are terrible here
      transform(_, ret: RawDocument) {
        delete ret.password
        delete ret.__v
      },
    },
  },
)

UserSchema.index({ username: 'text' })

UserSchema.statics.build = attrs => new User(attrs)

UserSchema.pre('save', async function save(this: ReturnDocument, done) {
  if (this.isModified('password')) {
    const hashed = await toHash(this.get('password') as string)

    this.set('password', hashed)
  }

  done()
})

export const User = model<RawDocument, UserModel>('User', UserSchema)
