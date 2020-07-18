'use strict'

const { test, trait } = use('Test/Suite')('Role')
trait('Test/Browser')

test('make sure 2 + 2 is 4', async ({ assert }) => {
  assert.equal(2 + 2, 4)
})
