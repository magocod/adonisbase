const { ServiceProvider } = require('@adonisjs/fold')

class QueueProvider extends ServiceProvider {
	/**
   * Register namespaces to the IoC container
   *
   * @method register
   *
   * @return {void}
   */
  register () {
    this.app.singleton('Bee/Queue', () => {
      const Config = this.app.use('Adonis/Src/Config')
      return new (require('.'))(Config)
    })
  }

  /**
   * Attach context getter when all providers have
   * been registered
   *
   * @method boot
   *
   * @return {void}
   */
  boot () {
    // console.log('boot Bee/Queue')
  }

}

module.exports = QueueProvider
