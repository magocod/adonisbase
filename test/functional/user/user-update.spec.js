'use strict'

const { test, trait } = use('Test/Suite')('User Update, auth/UserController')
trait('Test/ApiClient')
trait('Auth/Client')
trait('DatabaseTransactions')

const { validateAll } = use("Validator");

const User = use('App/Models/User');

const enumUsersID = require('../../fixtures/user.enum');
const enumRolesID = require('../../fixtures/role.enum');

test('update a user, success', async ({ client, assert }) => {

  const request = {
  	username: "user_change",
    email: "userupdated@mail.com",
    first_name: "change_f",
    last_name: "change_s",
  };

  const user = await User.find(enumUsersID.SUPER_USER);
  const userToUpdate = await User.create({
    username: 'user_u',
    first_name: 'user_f_u',
    last_name: 'user_s_u',
    email: 'useroriginal@mail.com',
    status: true,
    is_active: true,
    role_id: enumRolesID.USER,
    password: '123'
  });
  await userToUpdate.roles().attach([enumRolesID.USER])
  const usersInDb = await User.getCount();

  const response = await client.put(`/api/users/${userToUpdate.id}`)
  .loginVia(user, 'jwt')
  .send(request)
  .end();

  const userUpdated = await User
  .query()
  .where('id', response.body.data.id)
  .hasProfile()
  .first();

  response.assertStatus(200);

  response.assertJSON({
    message: 'Usuario modificado',
    data: userUpdated.toJSON()
  })

  assert.notEqual(userToUpdate.toJSON(), userUpdated.toJSON());

  // console.log(usersInDb, await User.getCount());
  assert.equal(usersInDb, await User.getCount());

})

test('check user edit form', async ({ client, assert }) => {

  const request = {
    username: 10,
    email: "userupdated.com",
    first_name: true,
    last_name: [],
  };

  const validation = await validateAll(request, User.update_rules);

  const user = await User.find(enumUsersID.SUPER_USER);
  const userToUpdate = await User.create({
    username: 'user_u',
    first_name: 'user_f_u',
    last_name: 'user_s_u',
    email: 'useroriginal@mail.com',
    status: true,
    is_active: true,
    role_id: enumRolesID.USER,
    password: '123'
  });
  await userToUpdate.roles().attach([enumRolesID.USER])
  const usersInDb = await User.getCount();

  const response = await client.put(`/api/users/${userToUpdate.id}`)
  .loginVia(user, 'jwt')
  .send(request)
  .end();

  const userNotUpdated = await User.find(userToUpdate.id)
  await userToUpdate.reload()

  response.assertStatus(422);

  response.assertJSON({
    errors: validation.messages()
  })

  // console.log(userToUpdate.toJSON())
  // console.log(userNotUpdated.toJSON())
  assert.equal(
    JSON.stringify(userToUpdate.toJSON()),
    JSON.stringify(userNotUpdated.toJSON())
  );

  // console.log(usersInDb, await User.getCount());
  assert.equal(usersInDb, await User.getCount());

})

test("can't edit superusers", async ({ client, assert }) => {

  const request = {
    username: 'editet_super_user',
    email: "userupdated@mail.com",
    first_name: 'name',
    last_name: 'other_name',
  };

  const user = await User.find(enumUsersID.SUPER_USER);
  const userToUpdate = await User.create({
    username: 'user_u',
    first_name: 'user_f_u',
    last_name: 'user_s_u',
    email: 'useroriginal@mail.com',
    status: true,
    is_active: true,
    role_id: enumRolesID.SUPER_USER,
    password: '123'
  });
  await userToUpdate.roles().attach([enumRolesID.SUPER_USER])
  const usersInDb = await User.getCount();

  const response = await client.put(`/api/users/${userToUpdate.id}`)
  .loginVia(user, 'jwt')
  .send(request)
  .end();

  const userNotUpdated = await User.find(userToUpdate.id)
  await userToUpdate.reload()

  // console.log(response);
  response.assertStatus(403);

  response.assertJSON({
    message: 'No tienes permiso para editar este usuario',
    details: "Solo un superusuario se puede modificar a si mismo",
    err_message: ""
  })

  // console.log(userToUpdate.toJSON())
  // console.log(userNotUpdated.toJSON())
  assert.equal(
    JSON.stringify(userToUpdate.toJSON()),
    JSON.stringify(userNotUpdated.toJSON())
  );

  // console.log(usersInDb, await User.getCount());
  assert.equal(usersInDb, await User.getCount());

})
