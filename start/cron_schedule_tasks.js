const CronJob = require('cron').CronJob;

async function sendEmails() {
	console.log('send emails');
}

const job = new CronJob(
	'* * * * * *',
	sendEmails
);

job.start()
