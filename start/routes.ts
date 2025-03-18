/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import SessionController from '#controllers/session_controller'
import UsersController from '#controllers/users_controller'
import {middleware} from '#start/kernel'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.post('/login', [SessionController, 'store'])
router.post('/register', [UsersController, 'register'])

router.get('/info', [UsersController, 'info']).use(middleware.auth({
  guards: ['api']
}))

router.get('/chats', [UsersController, 'getChats']).use(middleware.auth({
  guards: ['api']
}))
