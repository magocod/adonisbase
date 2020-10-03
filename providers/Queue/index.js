'use strict'

const BeeQueue = require('bee-queue')

class Queue {
  constructor (Config) {
    this.Config = Config
    this._queuesPool = {}
  }

  get (name) {
    /**
     * If there is an instance of queue already, then return it
     */
    if (this._queuesPool[name]) {
      return this._queuesPool[name]
    }

    /**
     * Read configuration using Config
     * provider
     */
    const config = this.Config.get(`queue.${name}`)
    // console.log('config', config)

    /**
     * Create a new queue instance and save it's
     * reference
     */
    const queue = new BeeQueue(name, config)

    const funcProcess = this.Config.get(`queue.${name}_process`)
    // console.log('funcProcess', funcProcess)
    if (funcProcess !== undefined) {
        queue.process(funcProcess);
    }

    this._queuesPool[name] = queue

    /**
     * Return the instance back
     */
    return this._queuesPool[name]
  }
}

module.exports = Queue
