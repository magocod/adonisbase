'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

class User extends Model {
  static boot () {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }

  static get hidden() {
    return ['is_active', 'password']
  }

  static get traits() {
    return [
      '@provider:Adonis/Acl/HasRole',
      '@provider:Adonis/Acl/HasPermission'
    ]
  }

  /**
   * [update_rules description]
   * @return {Object} [description]
   */
  static get update_rules() {
    return {
      username: "required|string|unique:users",
      email: "required|email|unique:users",
      first_name: "required|string",
      last_name: "required|string",
      // role_id: "required|range:1,4"
    };
  }

  static scopeHasProfile(query) {
    return query.with('roles').with('permissions');
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens () {
    return this.hasMany('App/Models/Token')
  }
}

module.exports = User
