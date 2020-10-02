const Agenda = require("Agenda");

const mongoConnectionString = 'mongodb://127.0.0.1:27017/agenda';

const agenda = new Agenda({db: {address: mongoConnectionString}});

agenda.define('send_emails_users', async job => {
  console.log('send emails')
});

(async function() { // IIFE to give access to async/await
  await agenda.start();

  await agenda.every('5 seconds', 'send_emails_users');

  // Alternatively, you could also do:
  // await agenda.every('*/3 * * * *', 'delete old users');
})();
