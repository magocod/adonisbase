'use strict'

const { test, trait } = use('Test/Suite')('Role List, auth/RoleController')
trait('Test/ApiClient')
trait('Auth/Client')

const User = use('App/Models/User');
const Role = use('Adonis/Acl/Role');

const enumUsersID = require('../../fixtures/user.enum');

test('Get all roles, success', async ({ client }) => {

  const user = await User.find(enumUsersID.ROOT);
  const roles = await Role.all();
  const response = await client.get('/api/roles').loginVia(user, 'jwt').end();

  // console.log(response);
  response.assertStatus(200);
  // console.log({ data: roles.toJSON() });
  response.assertJSON({
  	message: 'Operacion exitosa',
  	data: roles.toJSON()
  })

})

test('Root or administrator credentials required, failed', async ({ client }) => {

  let response = await client.get('/api/roles').end();
  response.assertStatus(401);

  const user = await User.find(enumUsersID.USER);
  response = await client.get('/api/roles').loginVia(user, 'jwt').end();
  // console.log(response);
  response.assertStatus(403);

})

test('Allow user administrators, failed', async ({ client }) => {

  const user = await User.find(enumUsersID.ADMIN);
  // console.log(await user.getRoles())
  const response = await client.get('/api/roles').loginVia(user, 'jwt').end();
  // console.log(response);
  response.assertStatus(200);

})
