'use strict'

const { ioc } = use('@adonisjs/fold')
const { test } = use('Test/Suite')('Task Summary Publications')

const User = use('App/Models/User')

const summaryPublications = require('../../schedule_tasks/tasks/summaryPublications')

test('test task db connected', async ({ assert }) => {
	const count = await User.getCount()

	const result = await summaryPublications(ioc)
  assert.equal(result, count)
})
