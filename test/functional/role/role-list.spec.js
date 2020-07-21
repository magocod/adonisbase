'use strict'

const { test, trait } = use('Test/Suite')('Role List, auth/RoleController')
trait('Test/ApiClient')
trait('Auth/Client')

const User = use('App/Models/User');
const Role = use('Adonis/Acl/Role');

const enumUsersID = require('../../fixtures/user.enum');

test('Get all roles, route: GET /roles, success', async ({ client }) => {

  const user = await User.find(enumUsersID.SUPER_USER);
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
