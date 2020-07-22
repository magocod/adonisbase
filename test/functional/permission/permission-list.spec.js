'use strict'

const { test, trait } = use('Test/Suite')('Permission List, auth/PermissionController')
trait('Test/ApiClient')
trait('Auth/Client')

const User = use('App/Models/User');

const enumUsersID = require('../../fixtures/user.enum');

test('Get all permissions, route: GET /permissions, success', async ({ client, assert }) => {
  const user = await User.find(enumUsersID.SUPER_USER);
  const response = await client.get('/api/permissions').loginVia(user, 'jwt').end();
  // console.log(response.body);
  response.assertStatus(200);
})
