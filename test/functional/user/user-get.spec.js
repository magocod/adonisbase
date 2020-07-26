'use strict'

const { test, trait } = use('Test/Suite')('User Get, auth/UserController')
trait('Test/ApiClient')
trait('Auth/Client')

const User = use('App/Models/User');

const enumUsersID = require('../../fixtures/user.enum');

test('Get a user by id, success', async ({ client, assert }) => {

  // const user = await User.find(enumUsersID.ROOT);
  const user = await User
  .query()
  .where('id', enumUsersID.ROOT)
  .hasProfile()
  .first();

  const response = await client.get(`/api/users/${enumUsersID.ROOT}`)
  .loginVia(user)
  .end();

  // console.log(response);
  response.assertStatus(200);
  response.assertJSON({
    message: 'Operacion exitosa',
    data: user.toJSON(),
  });

})

test('Get a user by id, parameter in invalid url, error', async ({ client, assert }) => {

  const user = await User.find(enumUsersID.ROOT);

  const response = await client.get(`/api/users/${null}`)
  .loginVia(user)
  .end();

  // console.log(response.body);
  response.assertStatus(404);

  assert.equal(response.body.error.message, 'Error buscando usuario');
  assert.equal(response.body.error.details, '');

})

test('Get a user by id, letter parameter in url, error', async ({ client, assert }) => {

  const user = await User.find(enumUsersID.ROOT);

  const response = await client.get('/api/users/hola')
  .loginVia(user)
  .end();

  // console.log(response.body);
  response.assertStatus(404);

})
