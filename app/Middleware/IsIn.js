'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const ForbiddenRoleException = use('App/Exceptions/ForbiddenRoleException')
// const ForbiddenException = require('adonis-acl/src/Exceptions/ForbiddenException')

/**
 *
 * verify if the authenticated user has at least one of the required roles
 *
 * - slug check
 * - do not use on unauthenticated routes
 *
 * example:
 *
 * Route.get('name', 'Controller.method').middleware('auth:jwt', 'isin:root,admin');
 *
 */
class IsIn {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ auth }, next, ...args) {
  	// console.log('args', args[0]);
    const expressions = args[0];

    if (Array.isArray(expressions) === false) {
      // throw new ForbiddenException()
      throw new ForbiddenRoleException()
    }

    const validation = []; // bool[]

    const rolesSlug = await auth.user.getRoles();
    // console.log('user_roles', rolesSlug)

    // call next to advance the request
    for (const roleName of expressions) {
        // too many requests for db
        // const is = await auth.user.is(roleName)
        // validation.push(is);
        validation.push(rolesSlug.includes(roleName))
    }

    // console.log('validation', validation);
    // console.log(validation.includes(true));

    if (!validation.includes(true)) {
      // throw new ForbiddenException()
      throw new ForbiddenRoleException()
    }
      
    await next()
  }
}

module.exports = IsIn
