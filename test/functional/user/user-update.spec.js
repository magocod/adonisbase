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

  const user = await User.find(enumUsersID.ROOT);
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

  const user = await User.find(enumUsersID.ROOT);
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

test("can't edit root users", async ({ client, assert }) => {

  const request = {
    username: 'edited_root_user',
    email: "userupdated@mail.com",
    first_name: 'name',
    last_name: 'other_name',
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
    password: '123'
  });
  await userToUpdate.roles().attach([enumRolesID.ROOT])
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
    details: "Solo un usuario root se puede modificar a si mismo",
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

test('email and unique username validation, error', async ({ client, assert }) => {

  const request = {
    username: 'unique',
    email: "unique@mail.com",
    first_name: 'unique',
    last_name: 'user',
  };
  const userExist = await User.create({
    username: 'unique',
    first_name: 'unique',
    last_name: 'user',
    email: 'unique@mail.com',
    status: true,
    is_active: true,
    role_id: enumRolesID.USER,
    password: '123'
  });
  await userExist.roles().attach([enumRolesID.USER])

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

  const validation = await validateAll(request, User.rules(userToUpdate.id));
  // console.log(validation.messages())
  const user = await User.find(enumUsersID.ROOT);
  const usersInDb = await User.getCount();

  const response = await client.put(`/api/users/${userToUpdate.id}`)
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

test('allow the update of unique fields, if they are the same in the user, success', async ({ client, assert }) => {

  const request = {
    username: 'unique',
    email: "unique@mail.com",
    first_name: 'new name',
    last_name: 'new last name',
  };
  const userExist = await User.create({
    username: 'unique',
    first_name: 'unique',
    last_name: 'user',
    email: 'unique@mail.com',
    status: true,
    is_active: true,
    role_id: enumRolesID.USER,
    password: '123'
  });
  await userExist.roles().attach([enumRolesID.USER])

  const validation = await validateAll(request, User.rules(userExist.id));
  // console.log(validation.messages())
  const user = await User.find(enumUsersID.ROOT);
  const usersInDb = await User.getCount();

  const response = await client.put(`/api/users/${userExist.id}`)
  .loginVia(user, 'jwt')
  .send(request)
  .end();

  const userUpdated = await User
  .query()
  .where('id', response.body.data.id)
  .hasProfile()
  .first();

  // console.log(response);
  // console.log(userExist.toJSON());
  // console.log(response.body.data);
  // console.log(userUpdated.toJSON());
  // console.log(usersInDb, await User.getCount());
  response.assertStatus(200);

  response.assertJSON({
    message: 'Usuario modificado',
    data: userUpdated.toJSON()
  })

  assert.equal(usersInDb, await User.getCount());

})
