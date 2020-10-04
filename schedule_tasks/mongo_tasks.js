const Agenda = require("Agenda");
// const { ioc } = require("@adonisjs/fold");

const summaryPublications = require('./tasks/summaryPublications')

// const Env = use('Env');
// const Logger = use('Logger')

// const ACTIVATE_SCHEDULED_TASKS = JSON.parse(Env.get('ACTIVATE_SCHEDULED_TASKS'));
// console.log(ACTIVATE_SCHEDULED_TASKS)

const mongoConnectionString = 'mongodb://127.0.0.1:27017/agenda';
const agenda = new Agenda({db: {address: mongoConnectionString}});

agenda.define('send_emails_users', async job => {
	console.log('init: mongo tasks')
	// call function task
	try {
		await summaryPublications(true)
	} catch(error) {
		console.log(error)
	}
	console.log('end: mongo tasks')
});

(async function() { // IIFE to give access to async/await
  await agenda.start();
  await agenda.every('1 seconds', 'send_emails_users');

  // Alternatively, you could also do:
  // await agenda.every('* * * * *', 'send_emails_users');
})();
