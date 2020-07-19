'use strict'

const { Command } = require('@adonisjs/ace')

const User = use('App/Models/User')
const Role = use('Adonis/Acl/Role')
const Permission = use('Adonis/Acl/Permission')

/**
 *
 * Note:
 *
 * - Factors to be added in users and roles
 *
 */
class TestUser extends Command {
  static get signature () {
    return 'test:user'
  }

  static get description () {
    return 'Tell something helpful about this command'
  }

  async handle (args, options) {
    this.info('Create test users')

    // roles

    const superUserRole = await Role.create({
      name: 'super_user',
      slug: 'super_user',
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
    
    const users = [
      // super users
      {
        username: 'super_user',
        first_name: 'Super',
        last_name: 'User',
        email: 'superuser@mail.com',
        status: true,
        is_active: true,
        role_id: superUserRole.id,
        password: '123'
      },
      {
        username: 'super_user_2',
        first_name: 'Super_2',
        last_name: 'User_2',
        email: 'superuser2@mail.com',
        status: true,
        is_active: true,
        role_id: superUserRole.id,
        password: '123'
      },
      // admins
      {
        username: 'admin',
        first_name: 'Admin',
        last_name: 'User',
        email: 'admin@mail.com',
        status: true,
        is_active: true,
        role_id: adminRole.id,
        password: '123'
      },
      {
        username: 'admin_2',
        first_name: 'Admin_2',
        last_name: 'User_2',
        email: 'admin2@mail.com',
        status: true,
        is_active: true,
        role_id: adminRole.id,
        password: '123'
      },
      {
        username: 'admin_3',
        first_name: 'Admin_3',
        last_name: 'User_3',
        email: 'admindisabled@mail.com',
        status: false,
        is_active: false,
        role_id: adminRole.id,
        password: '123'
      },
      // basic users
      {
        username: 'user',
        first_name: 'user',
        last_name: 'User',
        email: 'user@mail.com',
        status: true,
        is_active: true,
        role_id: userRole.id,
        password: '123'
      },
      {
        username: 'user_2',
        first_name: 'user_2',
        last_name: 'User_2',
        email: 'user2@mail.com',
        status: true,
        is_active: true,
        role_id: userRole.id,
        password: '123'
      },
      {
        username: 'user_3',
        first_name: 'user_3',
        last_name: 'User_3',
        email: 'userdisabled@mail.com',
        status: false,
        is_active: false,
        role_id: userRole.id,
        password: '123'
      }
    ];

    for (const userData of users) {
      const userInstance = await User.create(userData);
      await userInstance.roles().attach([userData.role_id])
    }

  }
}

module.exports = TestUser