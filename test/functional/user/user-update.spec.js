'use strict'

const { test, trait } = use('Test/Suite')('User Update, auth/UserController')
trait('Test/ApiClient')
trait('Auth/Client')
trait('DatabaseTransactions')

const User = use('App/Models/User');

const enumUsersID = require('../../fixtures/user.enum');
const enumRolesID = require('../../fixtures/role.enum');

test('update a user, success', async ({ client, assert }) => {

  const request = {
  	username: "user_change",
    email: "userdelete@mail.com",
    first_name: "change_f",
    last_name: "change_s",
  };

  const user = await User.find(enumUsersID.SUPER_USER);
  const userToUpdate = await User.create({
    username: 'user_u',
    first_name: 'user_f_u',
    last_name: 'user_s_u',
    email: 'userupdate@mail.com',
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
