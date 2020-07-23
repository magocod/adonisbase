'use strict'

const { test, trait } = use('Test/Suite')(
  'User General Filter, route: GET /api/user/filter/:page, auth/UserController.indexFilter'
)
trait('Test/ApiClient')
trait('Auth/Client')

const Env = use('Env');
const User = use('App/Models/User');
const { validateAll } = use("Validator");

const enumUsersID = require('../../fixtures/user.enum');

const PaginationPageSize = parseInt(Env.get('PAGINATION_PAGE_SIZE'));

test('Returns everything if it does not receive parameters', async ({ client }) => {

  const pagination = {
    page: 1,
    per_page: PaginationPageSize,
  };

  const request = {};

  const user = await User.find(enumUsersID.SUPER_USER);
  const users = await User
  .query()
  .hasProfile()
  .paginate(pagination.page, pagination.per_page);

  const response = await client.post(`/api/user/filter/${pagination.page}`)
  .loginVia(user, 'jwt')
  .send(request)
  .end();

  // console.log(users.toJSON())
  // console.log(response.body.data);
  response.assertStatus(200);

  response.assertJSON({
    message: 'Operacion exitosa',
    data: users.toJSON()
  })

})

test('allow null parameters', async ({ client }) => {

  const pagination = {
    page: 1,
    per_page: PaginationPageSize,
  };

  const request = {
    first_name: null,
    last_name: null,
    email: null,
  };

  const user = await User.find(enumUsersID.SUPER_USER);
  const users = await User
  .query()
  .hasProfile()
  .paginate(pagination.page, pagination.per_page);

  const response = await client.post(`/api/user/filter/${pagination.page}`)
  .loginVia(user, 'jwt')
  .send(request)
  .end();

  // console.log(users.toJSON())
  // console.log(response.body.data);
  response.assertStatus(200);

  response.assertJSON({
    message: 'Operacion exitosa',
    data: users.toJSON()
  })

})

test('if you receive parameters they must be valid', async ({ client }) => {

  const pagination = {
    page: 1,
    per_page: PaginationPageSize,
  };

  const request = {
    first_name: 10,
    last_name: 20,
    email: 15
  };

  const rules = {
    first_name: "string",
    last_name: "string",
    email: "string"
  };

  const messages = {
    'first_name.string': 'El campo primer nombre debe ser una cadena de caracteres',
    'last_name.string': 'El campo primer nombre debe ser una cadena de caracteres',
    'email.string': 'El campo primer nombre debe ser una cadena de caracteres'
  };

  const validation = await validateAll(request, rules, messages);

  const user = await User.find(enumUsersID.SUPER_USER);

  const response = await client.post(`/api/user/filter/${pagination.page}`)
  .loginVia(user, 'jwt')
  .send(request)
  .end();

  // console.log(response.body);
  response.assertStatus(422);

  response.assertJSON({
    errors: validation.messages()
  })

})

test('Filter all users by first_name success', async ({ client }) => {

  const pagination = {
    page: 1,
    per_page: PaginationPageSize,
  };

  const request = {
    first_name: 'super',
    last_name: '',
    email: '',
  };

  const user = await User.find(enumUsersID.SUPER_USER);
  const users = await User
  .query()
  .where('first_name', 'LIKE', '%' + request.first_name + '%')
  .hasProfile()
  .paginate(pagination.page, pagination.per_page);

  const response = await client.post(`/api/user/filter/${pagination.page}`)
  .loginVia(user, 'jwt')
  .send(request)
  .end();

  // console.log(users.toJSON())
  // console.log(response.body.data);
  response.assertStatus(200);

  response.assertJSON({
    message: 'Operacion exitosa',
    data: users.toJSON()
  })

})

test('Filter all users by last_name success', async ({ client }) => {

  const pagination = {
    page: 1,
    per_page: PaginationPageSize,
  };

  const request = {
    first_name: '',
    last_name: 'User_2',
    email: '',
  };

  const user = await User.find(enumUsersID.SUPER_USER);
  const users = await User
  .query()
  .where('last_name', 'LIKE', '%' + request.last_name + '%')
  .hasProfile()
  .paginate(pagination.page, pagination.per_page);

  const response = await client.post(`/api/user/filter/${pagination.page}`)
  .loginVia(user, 'jwt')
  .send(request)
  .end();

  // console.log(users.toJSON())
  // console.log(response.body.data);
  response.assertStatus(200);

  response.assertJSON({
    message: 'Operacion exitosa',
    data: users.toJSON()
  })

})

test('Filter all users by email success', async ({ client }) => {

  const pagination = {
    page: 1,
    per_page: PaginationPageSize,
  };

  const request = {
    first_name: '',
    last_name: '',
    email: 'superuser2@mail'
  };

  const user = await User.find(enumUsersID.SUPER_USER);
  const users = await User
  .query()
  .where('email', 'LIKE', '%' + request.email + '%')
  .hasProfile()
  .paginate(pagination.page, pagination.per_page);

  const response = await client.post(`/api/user/filter/${pagination.page}`)
  .loginVia(user, 'jwt')
  .send(request)
  .end();

  // console.log(users.toJSON())
  // console.log(response.body.data);
  response.assertStatus(200);

  response.assertJSON({
    message: 'Operacion exitosa',
    data: users.toJSON()
  })

})

test(
  'Filter all users by first_name and last_name success',
  async ({ client }) => {

  const pagination = {
    page: 1,
    per_page: PaginationPageSize,
  };

  const request = {
    first_name: 'Super',
    last_name: 'User',
    email: '',
  };

  const user = await User.find(enumUsersID.SUPER_USER);
  const users = await User
  .query()
  .where('first_name', 'LIKE', '%' + request.first_name + '%')
  .where('last_name', 'LIKE', '%' + request.last_name + '%')
  .hasProfile()
  .paginate(pagination.page, pagination.per_page);

  const response = await client.post(`/api/user/filter/${pagination.page}`)
  .loginVia(user, 'jwt')
  .send(request)
  .end();

  // console.log(users.toJSON())
  // console.log(response.body.data);
  response.assertStatus(200);

  response.assertJSON({
    message: 'Operacion exitosa',
    data: users.toJSON()
  })

})

test(
  'Filter all users by first_name and email success',
  async ({ client }) => {

  const pagination = {
    page: 1,
    per_page: PaginationPageSize,
  };

  const request = {
    first_name: 'admin',
    last_name: '',
    email: 'mail.com',
  };

  const user = await User.find(enumUsersID.SUPER_USER);
  const users = await User
  .query()
  .where('first_name', 'LIKE', '%' + request.first_name + '%')
  .where('email', 'LIKE', '%' + request.last_name + '%')
  .hasProfile()
  .paginate(pagination.page, pagination.per_page);

  const response = await client.post(`/api/user/filter/${pagination.page}`)
  .loginVia(user, 'jwt')
  .send(request)
  .end();

  // console.log(users.toJSON())
  // console.log(response.body.data);
  response.assertStatus(200);

  response.assertJSON({
    message: 'Operacion exitosa',
    data: users.toJSON()
  })

})

test(
  'Filter all users by last_name and email success',
  async ({ client }) => {

  const pagination = {
    page: 1,
    per_page: PaginationPageSize,
  };

  const request = {
    first_name: '',
    last_name: 'user',
    email: 'user',
  };

  const user = await User.find(enumUsersID.SUPER_USER);
  const users = await User
  .query()
  .where('last_name', 'LIKE', '%' + request.last_name + '%')
  .where('email', 'LIKE', '%' + request.email + '%')
  .hasProfile()
  .paginate(pagination.page, pagination.per_page);

  const response = await client.post(`/api/user/filter/${pagination.page}`)
  .loginVia(user, 'jwt')
  .send(request)
  .end();

  // console.log(users.toJSON())
  // console.log(response.body.data);
  response.assertStatus(200);

  response.assertJSON({
    message: 'Operacion exitosa',
    data: users.toJSON()
  })

})

test(
  'Filter all users by first_name & last_name & email, success',
  async ({ client }) => {

  const pagination = {
    page: 1,
    per_page: PaginationPageSize,
  };

  const request = {
    first_name: 'admin',
    last_name: 'user',
    email: 'mail.',
  };

  const user = await User.find(enumUsersID.SUPER_USER);
  const users = await User
  .query()
  .where('first_name', 'LIKE', '%' + request.first_name + '%')
  .where('last_name', 'LIKE', '%' + request.last_name + '%')
  .where('email', 'LIKE', '%' + request.email + '%')
  .hasProfile()
  .paginate(pagination.page, pagination.per_page);

  const response = await client.post(`/api/user/filter/${pagination.page}`)
  .loginVia(user, 'jwt')
  .send(request)
  .end();

  // console.log(users.toJSON())
  // console.log(response.body.data);
  response.assertStatus(200);

  response.assertJSON({
    message: 'Operacion exitosa',
    data: users.toJSON()
  })

})
