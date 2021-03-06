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
  Route.get('profile', 'auth/AuthController.currentUser').middleware(['auth']);
  Route.post('profile', 'auth/AuthController.updateProfile').middleware(['auth']);
  Route.get('logout', 'auth/AuthController.logout').middleware(['auth']);
  Route.post('change_password', 'auth/PasswordController.changePassword').middleware(['auth']);
}).prefix('api/auth');

// users
Route.group(() => {
  Route.put('update_password/:user_id', 'auth/PasswordController.updatePassword');
  Route.get('all/:page?', 'auth/UserController.indexPaginate');
  Route.post('filter/:page?', 'auth/UserController.indexFilter');
}).prefix('api/user').middleware(
  ['auth', 'isin:root,admin']
);
Route.resource('api/users', 'auth/UserController').apiOnly().middleware(
  ['auth', 'isin:root,admin']
);

// roles
Route.resource('api/roles', 'auth/RoleController').apiOnly().middleware(
  ['auth', "isin:root,admin"]
);

// permissions
Route.resource('api/permissions', 'auth/PermissionController').apiOnly().middleware(
  ['auth', "isin:root,admin"]
);

Route.get('api/csv', 'QueueController.csv')
Route.get('api/db', 'QueueController.db')
