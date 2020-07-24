'use strict'

const { test, trait } = use('Test/Suite')('Auth Password, auth/PasswordController')
trait('Test/ApiClient')
trait('Auth/Client')
trait('DatabaseTransactions')

const User = use('App/Models/User');

const Hash = use('Hash');
const { validateAll } = use("Validator");

const enumUsersID = require('../../fixtures/user.enum');
const enumRolesID = require('../../fixtures/role.enum');

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

	const user = await User.find(enumUsersID.ROOT);

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

  const user = await User.find(enumUsersID.ROOT);

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

  const verifyNewPassword = await Hash.verify(
    request.new_password,
    user.password
  );

  const verifyCurrentPassword = await Hash.verify(
    currentPassword,
    user.password
  );

  assert.equal(verifyNewPassword, false);
  assert.equal(verifyCurrentPassword, true);

})

test('passwords in invalid format, error', async ({ client, assert }) => {

  const currentPassword = '123';

  const request = {
    old_password: false,
    new_password: 10
  };

  const user = await User.find(enumUsersID.ROOT);

  const validation = await validateAll(request, passwordRules, passwordMessages);

  const response = await client.post('/api/auth/change_password')
  .loginVia(user, 'jwt')
  .send(request)
  .end();
  await user.reload();

  // console.log(response);
  response.assertStatus(422);

  response.assertJSON({
    errors: validation.messages()
  })

  const verifyNewPassword = await Hash.verify(
    request.new_password,
    user.password
  );

  const verifyCurrentPassword = await Hash.verify(
    currentPassword,
    user.password
  );

  assert.equal(verifyNewPassword, false);
  assert.equal(verifyCurrentPassword, true);

})

test('Validate form update user password, administrator, error', async ({ client, assert }) => {

  const currentPassword = '123';

  const request = {
    password: 20,
  };

  const user = await User.find(enumUsersID.ROOT);
  const userToUpdate = await User.create({
    username: 'user_u',
    first_name: 'user_f_u',
    last_name: 'user_s_u',
    email: 'useroriginal@mail.com',
    status: true,
    is_active: true,
    role_id: enumRolesID.USER,
    password: currentPassword
  });
  await userToUpdate.roles().attach([enumRolesID.USER])

  const rules = {
    password: "required|string"
  };

  const messages = {
    'password.required': 'La contraseña es requerida',
    'password.string': 'La contraseña debe ser una cadena de caracteres',
  };

  const validation = await validateAll(request, rules, messages);

  const response = await client.put(`/api/user/update_password/${userToUpdate.id}`)
  .loginVia(user, 'jwt')
  .send(request)
  .end();
  await userToUpdate.reload();

  // console.log(response);
  response.assertStatus(422);

  response.assertJSON({
    errors: validation.messages()
  })

  const verifyNewPassword = await Hash.verify(
    request.password,
    userToUpdate.password
  );

  const verifyCurrentPassword = await Hash.verify(
    currentPassword,
    userToUpdate.password
  );

  assert.equal(verifyNewPassword, false);
  assert.equal(verifyCurrentPassword, true);

})

test('update user password, administrator, success', async ({ client, assert }) => {

  const currentPassword = '123';

  const request = {
    password: '1234',
  };

  const user = await User.find(enumUsersID.ROOT);
  const userToUpdate = await User.create({
    username: 'user_u',
    first_name: 'user_f_u',
    last_name: 'user_s_u',
    email: 'useroriginal@mail.com',
    status: true,
    is_active: true,
    role_id: enumRolesID.USER,
    password: currentPassword
  });
  await userToUpdate.roles().attach([enumRolesID.USER])

  const rules = {
    password: "required|string"
  };

  const messages = {
    'password.required': 'La contraseña es requerida',
    'password.string': 'La contraseña debe ser una cadena de caracteres',
  };

  const validation = await validateAll(request, rules, messages);

  const response = await client.put(`/api/user/update_password/${userToUpdate.id}`)
  .loginVia(user, 'jwt')
  .send(request)
  .end();
  await userToUpdate.reload();

  // console.log(response);
  response.assertStatus(200);

  response.assertJSON({
    message: 'Contraseña modificada',
    data: null
  })

  const verifyNewPassword = await Hash.verify(
    request.password,
    userToUpdate.password
  );

  const verifyCurrentPassword = await Hash.verify(
    currentPassword,
    userToUpdate.password
  );

  assert.equal(verifyNewPassword, true);
  assert.equal(verifyCurrentPassword, false);

})

test('root user password, can only be modified by the same, administrator, success', async ({ client, assert }) => {

  const currentPassword = '123';

  const request = {
    password: '1234',
  };

  const user = await User.find(enumUsersID.ROOT);
  const userToUpdate = await User.create({
    username: 'user_u',
    first_name: 'user_f_u',
    last_name: 'user_s_u',
    email: 'useroriginal@mail.com',
    status: true,
    is_active: true,
    role_id: enumRolesID.ROOT,
    password: currentPassword
  });
  await userToUpdate.roles().attach([enumRolesID.ROOT])

  const response = await client.put(`/api/user/update_password/${userToUpdate.id}`)
  .loginVia(user, 'jwt')
  .send(request)
  .end();
  await userToUpdate.reload();

  // console.log(response);
  response.assertStatus(403);

  response.assertJSON({
    message: 'No tienes permiso para editar este usuario',
    details: "Solo un usuario root se puede modificar a si mismo",
    err_message: ""
  })

  const verifyNewPassword = await Hash.verify(
    request.password,
    userToUpdate.password
  );

  const verifyCurrentPassword = await Hash.verify(
    currentPassword,
    userToUpdate.password
  );

  assert.equal(verifyNewPassword, false);
  assert.equal(verifyCurrentPassword, true);

})
