'use strict'

const { test, trait } = use('Test/Suite')('Auth Logout, auth/AuthController')
trait('Test/ApiClient')
trait('Auth/Client')

const User = use('App/Models/User');
const enumUsersID = require('../../fixtures/user.enum');

test('close user session, success', async ({ client }) => {

  const user = await User.find(enumUsersID.ROOT);
  const response = await client.get('/api/auth/logout').loginVia(user).end();

  // console.log(response);
  response.assertStatus(200);

  response.assertJSON({
  	message: 'Se ha Deslogueado Sastifactoriamente',
  	data: null
  })

})

test('log out without being authenticated', async ({ client, assert }) => {

  const response = await client.get('/api/auth/logout').end();

  // console.log(response);
  response.assertStatus(401);

})
