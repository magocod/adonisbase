'use strict'

const { test, trait } = use('Test/Suite')('Auth Profile, auth/AuthController')
trait('Test/ApiClient')
trait('Auth/Client')
trait('DatabaseTransactions')

const User = use('App/Models/User');

const { validateAll } = use("Validator");

const enumUsersID = require('../../fixtures/user.enum');

const profileMessages = {
  'username.required': 'El nombre de usuario es requerido',
  'username.string': 'El nombre de usuario debe ser una cadena de caracteres',
  'username.unique': 'Este nombre de usuario se encuentra registrado en el sistema',
  'email.required': 'El correo electronico es requerido',
  'email.email': 'Por favor ingresar un correo electronico valido',
  'email.unique': 'Este correo electronico se encuentra registrado en el sistema',
  'first_name.required': 'El primer nombre es requerido',
  'first_name.string': 'El primer nombre debe ser una cadena de caracteres',
  'last_name.required': 'El segundo nombre es requerido',
  'last_name.string': 'El segundo nombre debe ser una cadena de caracteres',
}

test('get current user, success', async ({ client }) => {
  const user = await User.find(enumUsersID.ROOT);
  const userData = await User
	.query()
	.where('id', user.id)
	.hasProfile()
	.first();
  const response = await client.get('/api/auth/profile').loginVia(user).end();

  // console.log(response.body);
  response.assertStatus(200);

  response.assertJSON({
  	message: 'Consulta exitosa, usuario autenticado',
  	data: userData.toJSON()
  })
})

test('The user updates their profile, success', async ({ client, assert }) => {

  const request = {
    username: "user_change",
    email: "userupdated@mail.com",
    first_name: "change_f",
    last_name: "change_s",
  };

  const user = await User.find(enumUsersID.ROOT);
  const userData = await User
  .query()
  .where('id', user.id)
  .hasProfile()
  .first();

  const response = await client.post('/api/auth/profile')
  .loginVia(user)
  .send(request)
  .end();

  // console.log(response);
  const userUpdated = await User
  .query()
  .where('id', response.body.data.id)
  .hasProfile()
  .first();

  response.assertStatus(200);

  response.assertJSON({
    message: 'Perfil de usuario actualizado',
    data: userUpdated.toJSON()
  })

  // console.log(userData.toJSON());
  // console.log(userUpdated.toJSON());
  // console.log(response.body);

  assert.notEqual(
    JSON.stringify(userData.toJSON()),
    JSON.stringify(userUpdated.toJSON())
  )

})

test('Verify form modify profile, error', async ({ client, assert }) => {

  const request = {
    username: "root_2", // exist in TestUser command
    email: "root2@mail.com", // exist in TestUser command
    first_name: [],
    last_name: true,
  };

  const user = await User.find(enumUsersID.ROOT);

  const userData = await User
  .query()
  .where('id', user.id)
  .hasProfile()
  .first();

  const profileRules = {
    username: `required|string|unique:users,username,id,${user.id}`,
    email: `required|email|unique:users,email,id,${user.id}`,
    first_name: "required|string",
    last_name: "required|string"
  };

  const validation = await validateAll(request, profileRules, profileMessages);
  // console.log(validation.messages());

  const response = await client.post('/api/auth/profile')
  .loginVia(user)
  .send(request)
  .end();

  // console.log(response);
  const userUpdated = await User
  .query()
  .where('id', user.id)
  .hasProfile()
  .first();

  response.assertStatus(422);

  response.assertJSON({
    errors: validation.messages() 
  })

  // console.log(userData.toJSON());
  // console.log(userUpdated.toJSON());
  // console.log(response.body);

  assert.equal(
    JSON.stringify(userData.toJSON()),
    JSON.stringify(userUpdated.toJSON())
  )

})
