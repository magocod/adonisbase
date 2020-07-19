'use strict'

const { test, trait } = use('Test/Suite')('User List, auth/UserController')
trait('Test/ApiClient')

const User = use('App/Models/User');

test('Get all users success, route: GET /api/users', async ({ client }) => {

  const users = await User
  .query()
  .hasProfile()
  .fetch();
  const response = await client.get('/api/users').end();

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

  const users = await User
  .query()
  .hasProfile()
  .paginate(pagination.page, pagination.per_page);

  const response = await client.get(`/api/user/all/${pagination.page}`).end();

  // console.log(response.body.data);
  response.assertStatus(200);

  response.assertJSON({
    message: 'Operacion exitosa',
    data: users.toJSON()
  })

})

test('Filter all users success, route: GET /api/user/filter/:page', async ({ client }) => {

  const pagination = {
    page: 1,
    per_page: 5,
  };

  const request = {
    first_name: 'super',
  };

  const users = await User
  .query()
  .where('first_name', 'LIKE', '%' + request.first_name + '%')
  .hasProfile()
  .paginate(pagination.page, pagination.per_page);

  const response = await client.post(`/api/user/filter/${pagination.page}`).send(request).end();

  // console.log(users.toJSON())
  // console.log(response.body.data);
  response.assertStatus(200);

  response.assertJSON({
    message: 'Operacion exitosa',
    data: users.toJSON()
  })

})
