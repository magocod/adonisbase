'use strict'

const { test, trait } = use('Test/Suite')('Auth')
trait('Test/ApiClient')

const User = use('App/Models/User');

test('Login Super_user, route: POST /login, success', async ({ client, assert }) => {

	const authData = {
		email: 'superuser@mail.com',
		password: '123'
	};

  // const superUser = await User.create({
  //   username: 'super_user',
  //   first_name: 'Super',
		// last_name: 'User',
		// email: authData.email,
		// status: true,
		// is_active: true,
		// role_id: 1,
		// password: authData.password,
  // });

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
  // console.log(response.body.data.user)
  // console.log(userProfile.toJSON())
  assert.equal(
  	JSON.stringify(response.body.data.user),
  	JSON.stringify(userProfile.toJSON())
  );

  // response.assertJSONSubset({
  // 	message: 'Bienvenido',
  // 	data: {
  // 		user: userProfile,
  // 		access_token: accessToken
  // 	}
  // })


})
