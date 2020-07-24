'use strict'

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

const User = use('App/Models/User')
const Role = use('Adonis/Acl/Role')
const Permission = use('Adonis/Acl/Permission')

class UserSeeder {
  async run () {

  	// roles

  	const superUserRole = await Role.create({
  		name: 'root',
  		slug: 'root',
  		description: 'Posee todos los permisos'
  	});

  	const adminRole = await Role.create({
  		name: 'admin',
  		slug: 'admin',
  		description: 'Administrador del sistema'
  	});

  	const userRole = await Role.create({
  		name: 'user',
  		slug: 'user',
  		description: 'usuario del sistema'
  	});

    // users

  	const superUser = await User.create({
      username: 'root',
  		first_name: 'root',
	    last_name: 'root',
	    email: 'root@mail.com',
	    status: true,
	    is_active: true,
	    role_id: superUserRole.id,
	    password: '123'
  	});
    await superUser.roles().attach([superUserRole.id])

    const adminUser = await User.create({
      username: 'admin',
      first_name: 'Admin',
      last_name: 'User',
      email: 'admin@mail.com',
      status: true,
      is_active: true,
      role_id: adminRole.id,
      password: '123'
    });
    await adminUser.roles().attach([adminRole.id])

    const basicUser = await User.create({
      username: 'user',
      first_name: 'user',
      last_name: 'User',
      email: 'user@mail.com',
      status: true,
      is_active: true,
      role_id: userRole.id,
      password: '123'
    });
    await basicUser.roles().attach([userRole.id])


  }
}

module.exports = UserSeeder
