// import type { HttpContext } from '@adonisjs/core/http'

import User from "#models/user"
import db from '@adonisjs/lucid/services/db'
import { HttpContext } from "@adonisjs/core/http"

export default class UsersController {
    async login({request}: HttpContext) {
        const {email, password} = request.only(['email', 'password'])

        const user = await User.verifyCredentials(email, password)

        const token = await User.accessTokens.create(user)

        return token
    }

    async register({request}: HttpContext) {
        const { email, password } = request.only(['email', 'password'])

        const user = await User.create({ email, password })

        const token = await User.accessTokens.create(user)

        return token
    }

    async info({auth}: HttpContext) {
        return auth.user
    }

    async getChats({auth, response}: HttpContext) {
        const user = auth.getUserOrFail()

        const chattingWithUserId = await user.chattingWith

        if (!chattingWithUserId) {
            return response.abort({ message: 'Not chatting with any user' })
        }

        const chattingWithUser = await User.find(chattingWithUserId)

        if (!chattingWithUser) {
            user.chattingWith = null
            await user.save()
            return response.abort('Chatting with user not found')
        }

        const sentChats = await db.query().from('chats').where('sender_id', user.id).where('receiver_id', chattingWithUserId)
        const receivedChats = await db.query().from('chats').where('sender_id', chattingWithUserId).where('receiver_id', user.id)

        return {
            sent: sentChats,
            received: receivedChats
        }
    }
}
