const Queue = require('bull');

class RedisQueue {
  static init(name, config) {
    this.queue = new Queue(name, config);
  }

  static addJob(data, options = {}) {
    return this.queue.add(data, options);
  }

  static onMessage() {
    console.log(arguments.length);
    switch(arguments.length) {
      case 1: return this.queue.process(arguments[0]);
      case 2: {
        if(typeof arguments[0] === 'string' && typeof arguments[1] === 'function')
          return this.queue.process(arguments[0], arguments[1]);
      }
      case 3: {
        if(typeof arguments[0] === 'string' &&
          typeof arguments[1] === 'number' &&
          arguments[2] === 'function')
          return this.queue.process(arguments[0], arguments[1], arguments[2]);
      }
      default:
        throw new Error('Invalid arguments');
    }
  }

  static onCompleted(cb, options = {}) {
    return this.queue.process(cb);
  }
}

module.exports = RedisQueue;
