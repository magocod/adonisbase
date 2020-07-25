'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

class User extends Model {

  /**
   * [boot description]
   * @return {void} [description]
   */
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

  /**
   * [hidden description]
   * @return {string[]} [description]
   */
  static get hidden() {
    return ['is_active', 'password']
  }

  /**
   * [traits description]
   * @return {string[]} [description]
   */
  static get traits() {
    return [
      '@provider:Adonis/Acl/HasRole',
      '@provider:Adonis/Acl/HasPermission'
    ]
  }

  /**
   * [update_rules description]
   * @param  {Boolean} strict [description]
   * @return {[type]}         [description]
   */
  static get update_rules() {
    return {
      username: "required|string|unique:users,username",
      email: "required|email|unique:users,email",
      first_name: "required|string",
      last_name: "required|string",
      // role_id: "required|range:1,4"
    };
  }

  /**
   * [scopeHasProfile description]
   *
   * the user loads all their db relationships
   *
   * @param  {[type]} query [description]
   * @return {[type]}       [description]
   */
  static scopeHasProfile(query) {
    return query.with('roles').with('permissions');
  }

  /**
   * [rules description]
   * @return {Object} [description]
   */
  static rules(userId = 0) {
    // console.log(userId);
    if (userId === 0) {
      return {
        username: "required|string|unique:users,username",
        email: "required|email|unique:users,email",
        first_name: "required|string",
        last_name: "required|string",
      };
    }
    return {
      username: `required|string|unique:users,username,id,${userId}`,
      email: `required|email|unique:users,email,id,${userId}`,
      first_name: "required|string",
      last_name: "required|string"
    };
  }

  /**
   * [getRolesSlug description]
   *
   * get all current user roles (slug)
   *
   * @return {string[]} [description]
   */
  async getRolesSlug() {
    const roles = await this.roles().fetch().toJSON();
    return roles.map((role) => {
      return role.slug;
    })
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
