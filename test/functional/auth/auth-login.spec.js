'use strict'

const { test, trait } = use('Test/Suite')('Auth Login, auth/AuthController')
trait('Test/ApiClient')
trait('DatabaseTransactions')

const User = use('App/Models/User');

const { validateAll } = use("Validator");

const enumRolesID = require('../../fixtures/role.enum');

const authRules = {
    email: "required|email",
    password: "required|string"
};

const authRulesMessages = {
    'email.required': 'El correo electronico es requerido',
    'email.email': 'Por favor ingresar un correo valido',
    'password.required': 'La contraseña es requerida',
    'password.string': 'La contraseña debe ser una cadena de caracteres',
}

test('Root user login successful', async ({ client, assert }) => {

	const authData = {
		email: 'root@mail.com',
		password: '123'
	};

  const response = await client.post('/api/auth/login').send(authData).end();
  // const user = await User.findBy('email', authData.email);
  const userProfile = await User
    .query()
    .hasProfile()
    .where('email', authData.email)
    .first();
  // const accessToken = await auth.generate(user);

  // console.log(response);
  response.assertStatus(200);

  assert.equal(response.body.message, 'Bienvenido');
  // console.log(response.body.data)
  // console.log(userProfile.toJSON())
  assert.equal(
  	JSON.stringify(response.body.data.user),
  	JSON.stringify(userProfile.toJSON())
  );

  assert.equal(response.body.data.hasOwnProperty('access_token'), true)

  // response.assertJSONSubset({
  // 	message: 'Bienvenido',
  // 	data: {
  // 		user: userProfile,
  // 		access_token: accessToken
  // 	}
  // })

})

test('Credentials must be valid', async ({ client }) => {

  const authData = {
    email: null,
    password: 10
  };

  const validation = await validateAll(authData, authRules, authRulesMessages);

  const response = await client.post('/api/auth/login').send(authData).end();

  // console.log(response.body);
  response.assertStatus(422);

  response.assertJSON({
    errors: validation.messages()
  })

})

test('User not found, error', async ({ client, assert }) => {

  const authData = {
    email: 'no_exist@mail.com',
    password: '123'
  };

  const response = await client.post('/api/auth/login').send(authData).end();

  // console.log(response);
  response.assertStatus(404);

  assert.equal(response.body.error.message, 'Usuario no existe');
  assert.equal(response.body.error.details, '');

})

test('User is disabled, error', async ({ client, assert }) => {

  const authData = {
    email: 'disabled@mail.com',
    password: '123'
  };

  const user = await User.create({
    username: 'user_d',
    first_name: 'user_d',
    last_name: 'user_d',
    email: authData.email,
    status: false,
    is_active: false,
    role_id: enumRolesID.USER,
    password: authData.password
  });
  await user.roles().attach([enumRolesID.USER])

  const response = await client.post('/api/auth/login').send(authData).end();

  // console.log(response);
  response.assertStatus(403);

  assert.equal(
    response.body.error.message,
    'No puedes ingresar en este momentos, usuario desactivado'
  );
  assert.equal(response.body.error.details, '');

})
