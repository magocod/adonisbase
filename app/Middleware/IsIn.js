'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const ForbiddenRoleException = use('App/Exceptions/ForbiddenRoleException')
// const ForbiddenException = require('adonis-acl/src/Exceptions/ForbiddenException')

class IsIn {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ auth }, next, ...args) {
  	// console.log(args[0]);
    const expressions = args[0];
    if (Array.isArray(expressions) === false) {
      // throw new ForbiddenException()
      throw new ForbiddenRoleException()
    }

    const validation = []; // bool[]
    // call next to advance the request
    for (const roleName of expressions) {
        const is = await auth.user.is(roleName)
        validation.push(is);
    }
    // console.log(validation);
    // console.log(validation.includes(true));
    if (!validation.includes(true)) {
      // throw new ForbiddenException()
      throw new ForbiddenRoleException()
    }
      
    await next()
  }
}

module.exports = IsIn
