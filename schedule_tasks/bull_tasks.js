const Queue = require('bull');
// const { ioc } = require("@adonisjs/fold");

const Env = use('Env');
const Logger = use('Logger')

const ACTIVATE_SCHEDULED_TASKS = JSON.parse(Env.get('ACTIVATE_SCHEDULED_TASKS'));
// console.log(Env)
// console.log(ACTIVATE_SCHEDULED_TASKS)

// avoid activating tasks in functional tests
if (ACTIVATE_SCHEDULED_TASKS) {

	const summaryPublications = require('./tasks/summaryPublications')

	var testQueue = new Queue('test', 'redis://127.0.0.1:6379');

	testQueue.process(async (job) => {

	  // job.data contains the custom data passed when the job was created
	  // job.id contains id of this job.
	  // console.log(job)
	  const result = await summaryPublications(true)
	  return result

	})

	testQueue.add({}, { repeat: { cron: '1 * * * *' } });

	testQueue.on('completed', job => {
	  console.log(`Job with id ${job.id} has been completed`);
	})

} else {
	Logger.info(
		'schedule_tasks_' + new Date().getTime(),
		{
			report_message: 'scheduled tasks disabled on the server instance'
		}
	)
}
