'use strict'

const { test, trait } = use('Test/Suite')('Role')
trait('Test/ApiClient')

const Role = use('Adonis/Acl/Role');

test('Get all roles, route: GET (roles), success', async ({ client }) => {

  const roles = await Role.all()
  const response = await client.get('/api/roles').end();

  response.assertStatus(200);
  response.assertJSONSubset({
  	data: roles.toJSON()
  })

})
