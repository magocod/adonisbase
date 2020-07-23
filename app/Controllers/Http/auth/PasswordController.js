'use strict'

// const User = use('App/Models/User');
// const Role = use('Adonis/Acl/Role');

const Hash = use('Hash');
const { validateAll } = use("Validator");

/**
 *
 * Updates current user
 *
 * - current user password
 */
class PasswordController {

	/**
   * [changePassword description]
   *
   * the current user modifies his password, only if he knows his current password
   *
   * @param  {[type]} options.request  [description]
   * @param  {[type]} options.auth     [description]
   * @param  {[type]} options.response [description]
   * @return {[type]}                  [description]
   */
  async changePassword({ request, auth, response }) {
    try {

      const rules = {
        old_password: "required|string",
        new_password: "required|string"
      };

      const messages = {
        'old_password.required': 'La contraseña actual es requerido',
        'old_password.string': 'La contraseña actual debe ser una cadena de caracteres',
        'new_password.required': 'La nueva contraseña es requerida',
        'new_password.string': 'La nueva contraseña debe ser una cadena de caracteres',
      }

      const validation = await validateAll(request.all(), rules, messages);

      if (validation.fails()) {
        return response.status(422).send({
          errors: validation.messages()
        });
      }

      const { old_password, new_password } = request.all();

      const user = await auth.getUser();

      const verifyPassword = await Hash.verify(
        old_password,
        user.password
      );

      if (!verifyPassword) {
        // wrong current password
        return response.status(403).json({
          message: 'Contraseña actual incorrecta.',
          details: "",
          err_message: ""
        });
      };

      user.password = new_password;
      await user.save();

      return response.status(200).json({
        message: 'Su contraseña ha sido modificada con exito',
        data: null
      });
    } catch (error) {
      return response.status(
        error.status === undefined ? 400 : error.status
      ).json({
        message: 'Error modificando contraseña',
        details: "",
        err_message: error.message
      });
    }
  }

}

module.exports = PasswordController
