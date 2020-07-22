'use strict'

const { test, trait } = use('Test/Suite')('User Crud, auth/UserController')
trait('Test/ApiClient')
trait('Auth/Client')
trait('DatabaseTransactions')

const User = use('App/Models/User');
const { validateAll } = use("Validator");

const rules = {
  username: "required|string|unique:users",
  email: "required|email|unique:users",
  password: "required|string",
  first_name: "required|string",
  last_name: "required|string",
  role_id: "required|range:1,4"
};

const enumUsersID = require('../../fixtures/user.enum');

test('create a user', async ({ client, assert }) => {

  const request = {
    username: "new User",
    email: "newuser@gmail.com",
    password: "123",
    first_name: "new",
    last_name: "User",
    role_id: 3,
    // hello: "",
  };

  const user = await User.find(enumUsersID.SUPER_USER);
  const usersInDb = await User.getCount();

  const response = await client.post('/api/users')
  .loginVia(user, 'jwt')
  .send(request)
  .end();

  const userCreated = await User
  .query()
  .where('id', response.body.data.id)
  .hasProfile()
  .first();

  // console.log(userCreated.toJSON());

  // console.log(response);
  response.assertStatus(201);

  response.assertJSON({
    message: 'Usuario registrado',
    data: userCreated.toJSON()
  })

  // console.log(usersInDb, await User.getCount());
  assert.equal(usersInDb + 1, await User.getCount());

})

test('create user with wrong role, must be between 2 - 3, error', async ({ client, assert }) => {

  const request = {
    username: "new User",
    email: "newuser@gmail.com",
    password: "123",
    first_name: "new",
    last_name: "User",
    role_id: 1,
  };

  const validation = await validateAll(request, rules);
  // console.log(validation.messages())
  const user = await User.find(enumUsersID.SUPER_USER);
  const usersInDb = await User.getCount();

  const response = await client.post('/api/users')
  .loginVia(user, 'jwt')
  .send(request)
  .end();

  // console.log(response);
  // console.log(usersInDb, await User.getCount());
  response.assertStatus(422);
  response.assertJSON({
    errors: validation.messages()
  });

  assert.equal(usersInDb, await User.getCount());

})

test('all incorrect user parameters, error', async ({ client, assert }) => {

  const request = {
    username: 1,
    email: "newusercom",
    password: 20,
    first_name: true,
    last_name: false,
    role_id: 4,
  };

  const validation = await validateAll(request, rules);
  // console.log(validation.messages())
  const user = await User.find(enumUsersID.SUPER_USER);
  const usersInDb = await User.getCount();

  const response = await client.post('/api/users')
  .loginVia(user, 'jwt')
  .send(request)
  .end();

  // console.log(response);
  // console.log(usersInDb, await User.getCount());
  response.assertStatus(422);
  response.assertJSON({
    errors: validation.messages()
  });

  assert.equal(usersInDb, await User.getCount());

})

test('Get a user by id, success', async ({ client, assert }) => {

  // const user = await User.find(enumUsersID.SUPER_USER);
  const user = await User
  .query()
  .where('id', enumUsersID.SUPER_USER)
  .hasProfile()
  .first();

  const response = await client.get(`/api/users/${enumUsersID.SUPER_USER}`)
  .loginVia(user, 'jwt')
  .end();

  // console.log(response);
  response.assertStatus(200);
  response.assertJSON({
    message: 'Operacion exitosa',
    data: user.toJSON(),
  });

})

test('Get a user by id, parameter in invalid url, error', async ({ client, assert }) => {

  const user = await User.find(enumUsersID.SUPER_USER);

  const response = await client.get(`/api/users/${null}`)
  .loginVia(user, 'jwt')
  .end();

  // console.log(response.body);
  response.assertStatus(404);

  assert.equal(response.body.error.message, 'Error buscando usuario');
  assert.equal(response.body.error.details, '');

})

test('Get a user by id, letter parameter in url, error', async ({ client, assert }) => {

  const user = await User.find(enumUsersID.SUPER_USER);

  const response = await client.get('/api/users/hola')
  .loginVia(user, 'jwt')
  .end();

  // console.log(response.body);
  response.assertStatus(404);

})
