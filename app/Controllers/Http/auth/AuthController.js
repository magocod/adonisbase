'use strict'

const User = use('App/Models/User');
// const Role = use('Adonis/Acl/Role');

const { validateAll } = use("Validator");

class AuthController {

  /**
   * [login description]
   * 
   * user authentication (email, password)
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param  {any} options.auth        [description]
   * @param {Response} ctx.response    [description]
   */
  async login({ request, auth, response }) {
    try {

      const rules = {
        email: "required|email",
        password: "required|string"
      };

      const messages = {
        'email.required': 'El correo electronico es requerido',
        'email.email': 'Por favor ingresar un correo valido',
        'password.required': 'La contraseña es requerida',
        'password.string': 'La contraseña debe ser una cadena de caracteres',
      }

      const validation = await validateAll(request.all(), rules, messages);

      if (validation.fails()) {
        return response.status(422).send({
          errors: validation.messages()
        });
      }

      const { email, password } = request.all();

      const user = await User.findByOrFail('email', email);

      // I don't know how to fall in this line
      // if (user === null) {
      //   return response.status(404).json({
      //     error: {
      //       message: 'Usuario no existe',
      //       details: "",
      //       err_message: ""
      //     }
      //   });
      // }

      if (user.status == false) {
        return response.status(403).json({
          error: {
            message: 'No puedes ingresar en este momentos, usuario desactivado',
            details: "",
            err_message: ""
          }
        });
      }

      const tokenData = await auth.attempt(email, password)
      // console.log(tokenData);

      // const accessToken = await auth.generate(user)
      // console.log(accessToken);

      const userProfile = await User
        .query()
        .where('email', email)
        .hasProfile()
        .first();

      return response.status(200).json({
        message: 'Bienvenido',
        data: {
          user: userProfile,
          access_token: tokenData
        }
      });

    } catch (error) {
      // console.log(error);
      const errorMessage = {
        message: "Autenticacion fallida",
        details: "",
        err_message: error.message
      };
      if (error.status === 404) {
        errorMessage.message = 'Usuario no existe';
      }
      return response.status(
        error.status === undefined ? 400 : error.status
      ).json({ error: errorMessage });
    }
  }

  /**
   * [logout description]
   * @param {any} ctx.auth     [description]
   * @param {Response} ctx.response [description]
   */
  async logout({ auth, response }) {
    try {
      const user = await auth.getUser();
      await user.tokens().delete();
      return response.status(200).json({
        data: null,
        message: 'Se ha Deslogueado Sastifactoriamente'
      });
    } catch (error) {
      return response.status(
        error.status === undefined ? 400 : error.status
      ).json({
        message: 'Error cerrando sesion',
        details: "",
        err_message: error.message
      });
    }
  }

  /**
   * [currentUser description]
   * @param  {[type]} options.auth     [description]
   * @param  {[type]} options.response [description]
   * @return {Response}                  [description]
   */
  async currentUser({ auth, response }) {
    try {
      const user = await auth.getUser();
      const userData = await User
      .query()
      .where('id', user.id)
      .hasProfile()
      .first();
      return response.status(200).json({
        message: "Consulta exitosa, usuario autenticado",
        data: userData
      });
    } catch (error) {
      return response.status(
        error.status === undefined ? 400 : error.status
      ).json({
        message: 'Error recuperando usuario',
        details: "",
        err_message: error.message
      });
    }
  }

  /**
   * [updateProfile description]
   * @param  {[type]} options.auth     [description]
   * @param  {[type]} options.request  [description]
   * @param  {[type]} options.response [description]
   * @return {Response}                  [description]
   */
  async updateProfile({ auth, request, response }) {
    try {
      const user = await auth.getUser();

      const rules = {
        username: `required|string|unique:users,username,id,${user.id}`,
        email: `required|email|unique:users,email,id,${user.id}`,
        first_name: "required|string",
        last_name: "required|string"
      };

      const messages = {
        'username.required': 'El nombre de usuario es requerido',
        'username.string': 'El nombre de usuario debe ser una cadena de caracteres',
        'username.unique': 'Este nombre de usuario se encuentra registrado en el sistema',
        'email.required': 'El correo electronico es requerido',
        'email.email': 'Por favor ingresar un correo electronico valido',
        'email.unique': 'Este correo electronico se encuentra registrado en el sistema',
        'first_name.required': 'El primer nombre es requerido',
        'first_name.string': 'El primer nombre debe ser una cadena de caracteres',
        'last_name.required': 'El segundo nombre es requerido',
        'last_name.string': 'El segundo nombre debe ser una cadena de caracteres',
      }

      const validation = await validateAll(request.all(), rules, messages);

      if (validation.fails()) {
        return response.status(422).json({
          errors: validation.messages()
        });
      }

      const userData = request.all();

      user.username = userData.username;
      user.email = userData.email;
      user.first_name = userData.first_name;
      user.last_name = userData.last_name;
      await user.save();

      const userResponse = await User
      .query()
      .where('id', user.id)
      .hasProfile()
      .first();

      return response.status(200).json({
        message: "Perfil de usuario actualizado",
        data: userResponse
      });
    } catch (error) {
      return response.status(
        error.status === undefined ? 400 : error.status
      ).json({
        message: 'Error actualizando perfil de usuario',
        details: "",
        err_message: error.message
      });
    }
  }

}

module.exports = AuthController
