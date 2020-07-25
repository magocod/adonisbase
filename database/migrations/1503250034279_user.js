'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('username', 80).notNullable().unique()
      table.string('first_name', 80).notNullable()
      table.string('last_name', 80).notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      // news
      // skip the many-to-many relationship and assign a single role to the user
      table.integer('role_id').nullable()
      // table.integer('role_id').unsigned().references('id').inTable('roles')

      table.string('type_auth').nullable()
      table.boolean('status')
      table.boolean('is_active')
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
