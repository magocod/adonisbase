'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const User = use('App/Models/User');

const Env = use('Env');
const { validateAll } = use("Validator");

const PaginationPageSize = parseInt(Env.get('PAGINATION_PAGE_SIZE'));

/**
 * Resourceful controller for interacting with users
 */
class UserController {
  /**
   * Show a list of all users.
   * GET api/users
   *
   * @param {object} ctx
   * @param {Response} ctx.response
   */
  async index ({ response }) {
    try {
      const users = await User
      .query()
      .hasProfile()
      .fetch();
      return response.status(200).json({
        message: 'Operacion exitosa',
        data: users
      });
    } catch (error) {
      return response.status(error.status === undefined ? 400 : error.status).json({
        error: {
          message: "Error cargando usuarios",
          details: "",
          err_message: error.message
        }
      });
    }
  }

  /**
   * Show a list of all users (paginate).
   * GET api/user/all/{page}
   *
   * @param {object} ctx
   * @param {Response} ctx.response
   * @param {any} ctx.params
   */
  async indexPaginate ({ response, params }) {
    try {
      const page = params.page || 1;

      // console.log('page', typeof PaginationPageSize);

      const users = await User
      .query()
      .hasProfile()
      .paginate(page, PaginationPageSize);

      return response.status(200).json({
        message: 'Operacion exitosa',
        data: users
      });
    } catch (error) {
      return response.status(error.status === undefined ? 400 : error.status).json({
        error: {
          message: "Error cargando usuarios",
          details: "",
          err_message: error.message
        }
      });
    }
  }

  /**
   * Show a list of all users (paginate) with filteres.
   * POST api/user/filter/{page}
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {any} ctx.params
   */
  async indexFilter ({ request, response, params }) {
    try {
      const page = params.page || 1;

      const rules = {
        first_name: "string",
        last_name: "string",
        email: "string"
      };

      const messages = {
        'first_name.string': 'El campo primer nombre debe ser una cadena de caracteres',
        'last_name.string': 'El campo primer nombre debe ser una cadena de caracteres',
        'email.string': 'El campo primer nombre debe ser una cadena de caracteres'
      };

      const validation = await validateAll(request.all(), rules, messages);

      if (validation.fails()) {
        return response.status(422).send({
          errors: validation.messages()
        });
      }

      const { first_name, last_name, email } = request.all();
      // console.log(request.all());
      // console.log(first_name === undefined);

      const querySet = User.query()

      if (first_name !== null && first_name !== undefined) {
        querySet.where('first_name', 'LIKE', '%' + first_name + '%')
      }

      if (last_name !== null && last_name !== undefined) {
        querySet.where('last_name', 'LIKE', '%' + last_name + '%')
      }

      if (email !== null && email !== undefined) {
        querySet.where('email', 'LIKE', '%' + email + '%')
      }

      const paginationData = await querySet.hasProfile().paginate(page, PaginationPageSize);

      return response.status(200).json({
        message: 'Operacion exitosa',
        data: paginationData
      });
    } catch (error) {
      return response.status(error.status === undefined ? 400 : error.status).json({
        error: {
          message: "Error cargando usuarios",
          details: "",
          err_message: error.message
        }
      });
    }
  }

  /**
   * Create/save a new user.
   * POST users
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    try {
      const rules = {
        username: "required|string|unique:users",
        email: "required|email|unique:users",
        password: "required|string",
        first_name: "required|string",
        last_name: "required|string",
        role_id: "required|range:1,4"
      };

      const validation = await validateAll(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send({
          errors: validation.messages()
        });
      }

      const userData = request.only([
        'username',
        'email',
        'password',
        'first_name',
        'last_name',
        'role_id'
      ]);
      // console.log(userData);

      const userInstance = await User.create({
        ...userData,
        type_auth: 'web',
        status: true,
        is_active: true
      });
      // console.log(userInstance.toJSON());
      const userResponse = await User.query().where(
        'id', userInstance.id
      ).hasProfile().first();

      return response.status(201).json({
        message: 'Usuario registrado',
        data: userResponse
      });

    } catch (error) {
      return response.status(error.status === undefined ? 400 : error.status).json({
        error: {
          message: "Error registrando usuario",
          details: "",
          err_message: error.message
        }
      });
    }
  }

  /**
   * Display a single user.
   * GET users/:id
   *
   * @param {object} ctx
   * @param {Response} ctx.response
   */
  async show ({ params, response }) {
    try {
      // console.log(params);
      const userInstance = await User.findOrFail(params.id);
      const userResponse = await User
      .query()
      .where('id', userInstance.id)
      .hasProfile()
      .first();
      return response.status(200).json({
        message: 'Operacion exitosa',
        data: userResponse
      });
    } catch (error) {
      return response.status(error.status === undefined ? 400 : error.status).json({
        error: {
          message: "Error buscando usuario",
          details: "",
          err_message: error.message
        }
      });
    }
  }

  /**
   * Update user details.
   * PUT or PATCH users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    try {

      const rules = {
        username: `required|string|unique:users,username,id,${params.id}`,
        email: `required|email|unique:users,email,id,${params.id}`,
        first_name: "required|string",
        last_name: "required|string"
      };

      const validation = await validateAll(request.all(), rules);

      if (validation.fails()) {
        return response.status(422).send({
          errors: validation.messages()
        });
      }

      const userData = request.only([
        'username',
        'email',
        'first_name',
        'last_name',
        // 'role_id'
      ]);
      // console.log(userData);

      const userInstance = await User.findOrFail(params.id);

      const roles = await userInstance.roles().fetch();
      const rolesName = await roles.toJSON().map((role) => {
        return role.name;
      });

      if (rolesName.includes('root')) {
        // You do not have permission to edit this user
        return response.status(403).json({
          message: 'No tienes permiso para editar este usuario',
          details: "Solo un usuario root se puede modificar a si mismo",
          err_message: ""
        });
      }

      userInstance.username = userData.username;
      userInstance.email = userData.email;
      userInstance.first_name = userData.first_name;
      userInstance.last_name = userData.last_name;
      // userInstance.role_id = userData.role_id;
      
      await userInstance.save();

      const userResponse = await User.query().where(
        'id', userInstance.id
      ).hasProfile().first();

      return response.status(200).json({
        message: 'Usuario modificado',
        data: userResponse
      });

    } catch (error) {
      return response.status(error.status === undefined ? 400 : error.status).json({
        error: {
          message: "Error modificando usuario",
          details: "",
          err_message: error.message
        }
      });
    }
  }

  /**
   * Delete a user with id.
   * DELETE users/:id
   *
   * @param {object} ctx
   * @param {Response} ctx.response
   */
  async destroy ({ params, response, auth }) {
    try {
      // console.log(params);
      const userInstance = await User.findOrFail(params.id);

      if (auth.user.id == params.id) {
        // you cannot eliminate
        return response.status(403).json({
          message: 'No puedes eliminarte a ti mismo',
          details: "",
          err_message: ""
        });
      }

      const roles = await userInstance.roles().fetch();
      const rolesName = await roles.toJSON().map((role) => {
        return role.name;
      });

      if (rolesName.includes('root')) {
        // Cannot delete superusers with http queries
        return response.status(403).json({
          message: 'No tienes permiso para eliminar este usuario',
          details: "No se pueden eliminar usuarios root con consultas http",
          err_message: ""
        });
      }

      await userInstance.delete();

      return response.status(200).json({
        message: 'Usuario eliminado',
        data: null
      });
    } catch (error) {
      return response.status(error.status === undefined ? 400 : error.status).json({
        error: {
          message: "Error eliminando usuario",
          details: "",
          err_message: error.message
        }
      });
    }
  }
}

module.exports = UserController
