'use strict'

const { ioc } = use('@adonisjs/fold')
const { test } = use('Test/Suite')('Task Summary Publications')

const User = use('App/Models/User')

const summaryPublications = require('../../schedule_tasks/tasks/summaryPublications')

test('test task db connected', async ({ assert }) => {
	const count = await User.getCount()
	const result = await summaryPublications()
	// console.log(result)
  assert.equal(result, count)
})
