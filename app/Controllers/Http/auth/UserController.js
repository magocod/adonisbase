'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const User = use('App/Models/User');

const { validate } = use("Validator");

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

      const users = await User
      .query()
      .hasProfile()
      .paginate(page, 5);

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
        first_name: "string"
      };

      const messages = {
        'first_name': 'El campo primer nombre debe ser una cadena de caracteres',
      };

      const validation = await validate(request.all(), rules, messages);

      if (validation.fails()) {
        return response.status(422).send({
          error: validation.messages()
        });
      }

      const { first_name } = request.all();
      // console.log(request.all());

      const querySet = User.query()

      if (first_name !== null) {
        querySet.where('first_name', 'LIKE', '%' + first_name + '%')
      }

      const paginationData = await querySet.hasProfile().paginate(page, 5);

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
  }

  /**
   * Display a single user.
   * GET users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
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
  }

  /**
   * Delete a user with id.
   * DELETE users/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = UserController
