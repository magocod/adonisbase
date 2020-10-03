'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

const resultsSendMail = {
  OFF: 0,
	COMPLETED: 1,
	SUCCESS: 2,
	INCOMPLETE: 3,
	CRITICAL_ERROR: 4
}

class EmailNotification extends Model {

	/**
   * [hidden description]
   * @return {string[]} [description]
   */
  static get status() {
    return resultsSendMail
  }

}

module.exports = EmailNotification
