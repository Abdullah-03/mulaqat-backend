import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import Message from './message.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @hasMany(() => Message, {
    foreignKey: 'senderId',
  })
  declare sentMessages: HasMany<typeof Message>

  @hasMany(() => Message, {
    foreignKey: 'receiverId',
  })
  declare receivedMessages: HasMany<typeof Message>

  @hasOne(() => User, {
    foreignKey: 'chattingWith',
  })
  declare chattingWithUser: HasOne<typeof User>

  @hasMany(() => User, {
    foreignKey: 'chattingWith',
  })
  declare chattedWithUsers: HasMany<typeof User>

  @hasMany(() => User, {
    foreignKey: 'reportedBy',
  })
  declare reportedByUsers: HasMany<typeof User>

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare email: string

  @column()
  declare chattingWith: number | null

  @column()
  declare alreadyChattedWith: number[]

  @column()
  declare reportCount: number

  @column()
  declare isBanned: boolean

  @column()
  declare reportedBy: number[]

  @column({ serializeAs: null })
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User)
}