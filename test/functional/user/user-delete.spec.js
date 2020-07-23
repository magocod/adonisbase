'use strict'

const { test, trait } = use('Test/Suite')('User Delete, auth/UserController')
trait('Test/ApiClient')
trait('Auth/Client')
trait('DatabaseTransactions')

const User = use('App/Models/User');

const enumUsersID = require('../../fixtures/user.enum');
const enumRolesID = require('../../fixtures/role.enum');

test('delete a user, success', async ({ client, assert }) => {

  const user = await User.find(enumUsersID.SUPER_USER);
  const userToDelete = await User.create({
    username: 'user_delete',
    first_name: 'user_delete',
    last_name: 'User',
    email: 'userdelete@mail.com',
    status: true,
    is_active: true,
    role_id: enumRolesID.USER,
    password: '123'
  });
  await userToDelete.roles().attach([enumRolesID.USER])
  const usersInDb = await User.getCount();

  const response = await client.delete(`/api/users/${userToDelete.id}`)
  .loginVia(user, 'jwt')
  .end();

  response.assertStatus(200);

  response.assertJSON({
    message: 'Usuario eliminado',
    data: null
  })

  // console.log(usersInDb, await User.getCount());
  assert.equal(usersInDb - 1, await User.getCount());

})

test('The user cannot be deleted by himself', async ({ client, assert }) => {

  const user = await User.find(enumUsersID.SUPER_USER);
  const usersInDb = await User.getCount();

  const response = await client.delete(`/api/users/${user.id}`)
  .loginVia(user, 'jwt')
  .end();

  response.assertStatus(403);

  response.assertJSON({
    message: 'No puedes eliminarte a ti mismo',
    details: "",
    err_message: ""
  })

  // console.log(usersInDb, await User.getCount());
  assert.equal(usersInDb, await User.getCount());

})

test('Cannot delete superusers with http queries', async ({ client, assert }) => {

  const user = await User.find(enumUsersID.SUPER_USER);
  const userToDelete = await User.create({
    username: 'user_delete',
    first_name: 'user_delete',
    last_name: 'User',
    email: 'userdelete@mail.com',
    status: true,
    is_active: true,
    role_id: enumRolesID.SUPER_USER,
    password: '123'
  });
  await userToDelete.roles().attach([enumRolesID.SUPER_USER])
  const usersInDb = await User.getCount();

  const response = await client.delete(`/api/users/${userToDelete.id}`)
  .loginVia(user, 'jwt')
  .end();

  response.assertStatus(403);

  response.assertJSON({
    message: 'No tienes permiso para eliminar este usuario',
    details: "No se pueden eliminar superusuarios con consultas http",
    err_message: ""
  })

  // console.log(usersInDb, await User.getCount());
  assert.equal(usersInDb, await User.getCount());

})
