const CronJob = require('cron').CronJob;
const { ioc } = require("@adonisjs/fold");

const summaryPublications = require('./tasks/summaryPublications')

const Env = use('Env');
const Logger = use('Logger')

const ACTIVATE_SCHEDULED_TASKS = JSON.parse(Env.get('ACTIVATE_SCHEDULED_TASKS'));
// console.log(Env)
// console.log(ACTIVATE_SCHEDULED_TASKS)

// avoid activating tasks in functional tests
if (ACTIVATE_SCHEDULED_TASKS) {
	const job = new CronJob(
		'* * * * * *',
		async () => {
			try {
				console.log('init: cron tasks')
				// call function task
				await summaryPublications(ioc, true)
				console.log('end: cron tasks')
			} catch(error) {
				console.log(error)
				console.log('end: error cron tasks')
			}
		}
	);

	job.start()
} else {
	Logger.info(
		'summaryPublications_' + new Date().getTime(),
		{
			report_message: 'scheduled tasks disabled on the server instance'
		}
	)
}
