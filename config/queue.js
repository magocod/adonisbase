'use strict'

const Env = use('Env')

const sharedConfig = {
  redis: {
    host: '127.0.0.1',
    port: 6379,
    password: process.env.DB_PASS,
    db: 0,
    options: {},
  }
};

module.exports = {
  /*
  |--------------------------------------------------------------------------
  | queue
  |--------------------------------------------------------------------------
  |
  | ...
  |
  */

  /**
   * [csv description]
   * @type {Object}
   */
	csv: {
    ...sharedConfig
    // others
	},

  /**
   * [csv_process description]
   * @param  {[type]}   job  [description]
   * @param  {Function} done [description]
   * @return {[type]}        [description]
   */
  csv_process(job, done) {
    console.log(`Processing job ${job.id}`);

    console.log(job.data)
    const totalLines = 1500

    for (var i = 0; i < totalLines; i++) {
      // console.log(i)
      if (i === 500) {
        job.reportProgress({number: 500, total: totalLines});
      }
      if (i === 1000) {
        job.reportProgress({number: 1000, total: totalLines});
      }
    }

    return done(null, job.data.x + job.data.y);
  },

  /**
   * [db description]
   * @type {Object}
   */
  db: {
    ...sharedConfig
    // others
  },
  
}