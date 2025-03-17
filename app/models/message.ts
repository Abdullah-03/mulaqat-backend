import { BaseModel, belongsTo, column } from "@adonisjs/lucid/orm";
import { DateTime } from "luxon";
import User from "./user.js";
import type { BelongsTo } from "@adonisjs/lucid/types/relations";

export default class Message extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare content: string

  @column()
  declare senderId: number

  @column()
  declare receiverId: number

  @column()
  declare createdAt: DateTime

  @column()
  declare updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'senderId',
    localKey: 'id',
  })
  declare sender: BelongsTo<typeof User>

  @belongsTo(() => User, {
    foreignKey: 'receiverId',
    localKey: 'id',
  })
  
  declare receiver: BelongsTo<typeof User>
}