'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EmailNotificationSchema extends Schema {
  up () {
    this.create('email_notifications', (table) => {
      table.increments()
      // table.json('emails_id').notNullable() // number[]
      table.integer('quantity_to_send').notNullable()
      table.integer('amount_sent').notNullable()
      // 1 completed, 2 success, 3 incomplete, 4 critical error
      table.integer('status').notNullable()
      table.text('error')
      table.timestamps()
    })
  }

  down () {
    this.drop('email_notifications')
  }
}

module.exports = EmailNotificationSchema
