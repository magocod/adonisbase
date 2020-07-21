'use strict'

const { test, trait } = use('Test/Suite')('User List, auth/UserController')
trait('Test/ApiClient')
trait('Auth/Client')

const User = use('App/Models/User');

const enumUsersID = require('../../fixtures/user.enum');

test('Get all users success, route: GET /api/users', async ({ client }) => {

  const user = await User.find(enumUsersID.SUPER_USER);
  const users = await User
  .query()
  .hasProfile()
  .fetch();
  const response = await client.get('/api/users').loginVia(user, 'jwt').end();

  // console.log(response.body);
  response.assertStatus(200);

  response.assertJSON({
  	message: 'Operacion exitosa',
  	data: users.toJSON()
  })

})

test('Get all paginate users success, route: GET /api/user/all/?page', async ({ client }) => {

  const pagination = {
    page: 1,
    per_page: 5,
  };

  const user = await User.find(enumUsersID.SUPER_USER);
  const users = await User
  .query()
  .hasProfile()
  .paginate(pagination.page, pagination.per_page);

  const response = await client.get(`/api/user/all/${pagination.page}`).loginVia(user, 'jwt').end();

  // console.log(response.body.data);
  response.assertStatus(200);

  response.assertJSON({
    message: 'Operacion exitosa',
    data: users.toJSON()
  })

})
