'use strict'

const User = use('App/Models/User');
// const Role = use('Adonis/Acl/Role');

const { validate } = use("Validator");

class AuthController {

    async login({ request, auth, response }) {
        try {

            const rules = {
                email: "required|email",
                password: "required"
            };

            const messages = {
                'email.required': 'El correo electronico es requerido',
                'email.email': 'Por favor ingresar un correo valido',
                'password.required': 'La contraseña es requerida',
            }

            const validation = await validate(request.all(), rules, messages);

            if (validation.fails()) {
                return response.status(422).send({
                    error: validation.messages()
                });
            }

            const { email, password } = request.all();

            const user = await User.findByOrFail('email', email);

            if (user === null) {
                return response.status(404).json({
                    message: 'Usuario no existe',
                    details: "",
                    err_message: ""
                });
            }

            if (user.status === false) {
                return response.status(403).json({
                    message: 'No puedes ingresar en este momentos, porfavor valida tu cuenta',
                    details: "",
                    err_message: ""
                });
            }

            const tokenData = await auth.attempt(email, password)
            // console.log(tokenData);

            // const accessToken = await auth.generate(user)
            // console.log(accessToken);

            const userProfile = await User
                .query()
                .hasProfile()
                .where('email', email)
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
                errorMessage.details = 'Usuario no existe';
            }
            return response.status(
                error.status === undefined ? 400 : error.status
            ).json(errorMessage);
        }
    }

}

module.exports = AuthController
