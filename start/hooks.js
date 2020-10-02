const CronJob = require('cron').CronJob;
const { ioc } = require("@adonisjs/fold");
const { hooks } = require("@adonisjs/ignitor");

hooks.after.httpServer(() => {

	const User = ioc.use('App/Models/User')

	const job = new CronJob(
		'* * * * * *',
		async () => {
			console.log('send emails');
			const count = await User.getCount()
			console.log(count)
			const users = await User.query().fetch()
			const usersEmails = users.toJSON().map((user) => {
				return user.email
			})
			console.log(usersEmails)
		}
	);

	job.start()

})
