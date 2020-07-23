'use strict'

const { test, trait } = use('Test/Suite')('Auth Password, auth/PasswordController')
trait('Test/ApiClient')
trait('Auth/Client')
trait('DatabaseTransactions')

const User = use('App/Models/User');

const Hash = use('Hash');
const { validateAll } = use("Validator");

const enumUsersID = require('../../fixtures/user.enum');

const passwordRules = {
  old_password: "required|string",
  new_password: "required|string"
};

const passwordMessages = {
  'old_password.required': 'La contraseña actual es requerido',
  'old_password.string': 'La contraseña actual debe ser una cadena de caracteres',
  'new_password.required': 'La nueva contraseña es requerida',
  'new_password.string': 'La nueva contraseña debe ser una cadena de caracteres',
};

test('the user modifies his password, success', async ({ client, assert }) => {

	const request = {
		old_password: '123',
		new_password: '1234'
	};

	const user = await User.find(enumUsersID.SUPER_USER);

	const validation = await validateAll(request, passwordRules, passwordMessages);

	const response = await client.post('/api/auth/change_password')
	.loginVia(user, 'jwt')
	.send(request)
	.end();
	await user.reload();

	// console.log(response);
	response.assertStatus(200);

	response.assertJSON({
  	message: 'Su contraseña ha sido modificada con exito',
  	data: null
  })

  const verifyOldPassword = await Hash.verify(
    request.old_password,
    user.password
  );

  const verifyNewPassword = await Hash.verify(
    request.new_password,
    user.password
  );

  assert.equal(verifyOldPassword, false);
  assert.equal(verifyNewPassword, true);

})

test('wrong current password, error', async ({ client, assert }) => {

  const currentPassword = '123';

  const request = {
    old_password: 'error',
    new_password: '1234'
  };

  const user = await User.find(enumUsersID.SUPER_USER);

  const validation = await validateAll(request, passwordRules, passwordMessages);

  const response = await client.post('/api/auth/change_password')
  .loginVia(user, 'jwt')
  .send(request)
  .end();
  await user.reload();

  // console.log(response);
  response.assertStatus(403);

  response.assertJSON({
    message: 'Contraseña actual incorrecta.',
    details: '',
    err_message: ''
  })

  const verifyOldPassword = await Hash.verify(
    request.old_password,
    user.password
  );

  const verifyNewPassword = await Hash.verify(
    request.new_password,
    user.password
  );

  const verifyCurrentPassword = await Hash.verify(
    currentPassword,
    user.password
  );

  assert.equal(verifyOldPassword, false);
  assert.equal(verifyNewPassword, false);
  assert.equal(verifyCurrentPassword, true);

})
