'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')
const { validateAll } = use("Validator");

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
   * [create_rules description]
   * @return {[type]} [description]
   */
  static create_rules() {
    return {
      username: "required|string|unique:users,username",
      email: "required|email|unique:users,email",
      first_name: "required|string",
      last_name: "required|string",
      role_id: "required|range:1,4",
    };
  }

  /**
   * [update_rules description]
   * 
   * userId = 0, ID equal to zero to not apply update rule by ID
   *
   * @param  {Number} userId [description]
   * @return {[type]}        [description]
   */
  static update_rules(userId) {
    return {
      username: `required|string|unique:users,username,id,${userId}`,
      email: `required|email|unique:users,email,id,${userId}`,
      first_name: "required|string",
      last_name: "required|string",
    };
  }

  /**
   * [validate description]
   *
   * userId = 0, ID equal to zero to not apply update rule by ID
   *
   * @param  {[type]} data [description]
   * @param  {Number} id   [description]
   * @return {[type]}      [description]
   */
  static validate(data, userId = 0) {
    let rules = this.create_rules();
    if (userId !== 0) {
      rules = this.update_rules(userId)
    }
    return validateAll(data, rules);
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

  /**
   * [role description]
   *
   * skip the many-to-many relationship and assign a single role to the user
   * 
   * @return {[type]} [description]
   */
  // role() {
  //   return this.belongsTo('Adonis/Acl/Role', 'role');
  // }

}

module.exports = User
