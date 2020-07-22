'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

const message = 'Access forbidden. You are not allowed to this resource.'
const status = 403
const code = 'ROLE NOT ALLOWED'

class ForbiddenRoleException extends LogicalException {
  constructor () {
    super(message, status, code)
  }
}

module.exports = ForbiddenRoleException
