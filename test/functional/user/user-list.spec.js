'use strict'

const { test, trait } = use('Test/Suite')('User List, auth/UserController')
trait('Test/ApiClient')
trait('Auth/Client')

const Env = use('Env');
const User = use('App/Models/User');

const enumUsersID = require('../../fixtures/user.enum');

const PaginationPageSize = parseInt(Env.get('PAGINATION_PAGE_SIZE'));

test('Get all users, success', async ({ client }) => {

  const user = await User.find(enumUsersID.ROOT);
  const users = await User
  .query()
  .hasProfile()
  .fetch();
  const response = await client.get('/api/users').loginVia(user).end();

  // console.log(response.body);
  response.assertStatus(200);

  response.assertJSON({
  	message: 'Operacion exitosa',
  	data: users.toJSON()
  })

})

test('Get all paginate users, success', async ({ client }) => {

  const pagination = {
    page: 1,
    per_page: PaginationPageSize,
  };

  const user = await User.find(enumUsersID.ROOT);
  const users = await User
  .query()
  .hasProfile()
  .paginate(pagination.page, pagination.per_page);

  const response = await client.get(`/api/user/all/${pagination.page}`).loginVia(user).end();

  // console.log(response.body.data);
  response.assertStatus(200);

  response.assertJSON({
    message: 'Operacion exitosa',
    data: users.toJSON()
  })

})
