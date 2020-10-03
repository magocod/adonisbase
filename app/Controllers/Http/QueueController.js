'use strict'

const Queue = use('Bee/Queue')
const User = use('App/Models/User')

class QueueController {

	/**
	 * [csv description]
	 * @return {[type]} [description]
	 */
	async csv({ request, response }) {
		const queue = Queue.get('csv')
		const job = await queue.createJob({ x: 2, y: 3 })
		job.save()
		// console.log(job)

		job.on('succeeded', (result) => {
		  console.log(`Received result for job ${job.id}: ${result}`);
		});

		job.on('progress', (progress) => {
		  console.log(
		    `Job ${job.id} reported progress: for ${progress.number} -> total: ${progress.total}`
		  );
		});
	}

	/**
	 * [db description]
	 * @param  {[type]} options.request  [description]
	 * @param  {[type]} options.response [description]
	 * @return {[type]}                  [description]
	 */
	async db({ request, response }) {
		const queue = Queue.get('db')

		// console.log('before', queue.handler)
		// prevent Cannot call Queue#process twice
		if (queue.handler === undefined) {
			queue.process(async (job) => {
				const user = await User.query().where('id', job.data.user_id).first()
			  console.log(`Processing job ${job.id}`);
			  // console.log(user)
			  return user.toJSON()
			});
		}
		// console.log('after', queue.handler)

		const job = await queue.createJob({ user_id: 1 })
		job.save()

		job.on('succeeded', (result) => {
		  console.log(`Received result for job ${job.id}:`);
		  console.log(result)
		});
	}

}

module.exports = QueueController
