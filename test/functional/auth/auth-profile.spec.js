'use strict'

const { test, trait } = use('Test/Suite')('Auth Profile, auth/AuthController')
trait('Test/ApiClient')
trait('Auth/Client')

const User = use('App/Models/User');
const enumUsersID = require('../../fixtures/user.enum');


test('get current user jwt, success', async ({ client }) => {
  const user = await User.find(enumUsersID.ROOT);
  const userData = await User
	.query()
	.where('id', user.id)
	.hasProfile()
	.first();
  const response = await client.get('/api/auth/profile').loginVia(user, 'jwt').end();

  // console.log(response.body);
  response.assertStatus(200);

  response.assertJSON({
  	message: 'Consulta exitosa, usuario autenticado',
  	data: userData.toJSON()
  })
})
