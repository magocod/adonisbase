const { ioc } = require("@adonisjs/fold");

/**
 * [summaryPublications description]
 *
 * - log info
 * interface infoReport {
 * 	 quantity_to_send: number; // total emails to send
 * 	 amount_sent: number; // emails sended
 * 	 status: number; // code status
 * }
 *
 * - log error
 * interface errorReport {
 * 	 error: string; // details error (custom)
 * 	 error_message: string; // error.message (property)
 * }
 *
 */
async function summaryPublications(debug = false) {
	if (debug) {
		console.log('init: summaryPublications');
	}

	// load dependencies
	const User = ioc.use('App/Models/User')
	const EmailNotification = ioc.use('App/Models/EmailNotification')

	// console.log(ioc)
	// console.log(User)

	const Logger = ioc.use('Logger')

	// console.log(ioc)
	// console.log(User)

	// found users to notify
	const count = await User.getCount()
	if (debug) {
		console.log(count)
	}

	// send emails
	// try {
	// 	// ...
	// } catch (error) {
	// 	// ...
	// }

	// save results
	await EmailNotification.create({
		quantity_to_send: count,
		amount_sent: 0,
		status: 0,
		error: ''
	})

	if (debug) {
		console.log('end: summaryPublications')
	}

	Logger.info(
		'summaryPublications_' + new Date().getTime(),
		{
			report: {
				quantity_to_send: count
			}
		}
	)
	return count
}

module.exports = summaryPublications
