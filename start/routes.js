'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})

Route.group(() => {
  Route.post('login', 'auth/AuthController.login');
}).prefix('api/auth');

// users
Route.group(() => {
  Route.get('all/:page?', 'auth/UserController.indexPaginate');
  Route.post('filter/:page?', 'auth/UserController.indexFilter');
}).prefix('api/user');
Route.resource('api/users', 'auth/UserController').apiOnly();

// roles
Route.resource('api/roles', 'auth/RoleController').apiOnly();
