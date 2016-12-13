var Topics = require('./index');
var assert = require('assert');
var mediator = require('fh-wfm-mediator/lib/mediator');
describe('Topics', function() {
  beforeEach(function() {
    this.topics = new Topics(mediator).prefix('wfm:cloud').entity('user');
  });
  afterEach(function() {
    this.topics.unsubscribeAll();
  });
  describe('#getTopic', function() {
    it('should return a namespaced topic', function() {
      assert(this.topics.getTopic('create'), 'wfm:cloud:user:create');
    });
    it('should take an optional prefix', function() {
      assert(this.topics.getTopic('create', 'done'), 'done:wfm:cloud:user:create');
    });
  });

  describe('#on', function() {
    it('should subscribe to a namespaced topic', function(done) {
      this.topics.on('create', function(user) {
        assert.equal(user.id, 'trever');
        done();
      });
      mediator.publish(this.topics.getTopic('create'), {id: 'trever'});
    });

    it('should publish a done: event for a successful promise', function(done) {
      this.topics.on('create', function(user) {
        assert.equal(user.id, 'trever');
        return Promise.resolve(user);
      });
      this.topics.onDone('create:trever', function(user) {
        assert.equal(user.id, 'trever');
        done();
      });
      mediator.publish(this.topics.getTopic('create'), {id: 'trever'});
    });
    it('should use result.id as a uid for request calls', function(done) {
      this.topics.on('create', function(user) {
        assert.equal(user.id, 'trever');
        return Promise.resolve(user);
      });
      this.topics.onDone('create:trever', function(user) {
        assert.equal(user.id, 'trever');
        done();
      });
      mediator.publish(this.topics.getTopic('create'), {id: 'trever'});
    });
    it('should use result as a uid for request calls if result is a string', function(done) {
      this.topics.on('create', function(user) {
        assert.equal(user.id, 'trever');
        return Promise.resolve('trever');
      });
      this.topics.onDone('create:trever', function(name) {
        assert.equal(name, 'trever');
        done();
      });
      mediator.publish(this.topics.getTopic('create'), {id: 'trever'});
    });
    it('should publish an error: event for a unsuccessful promise', function(done) {
      this.topics.on('create', function() {
        return Promise.reject(new Error('kaboom'));
      });
      this.topics.onError('create', function(e) {
        assert.equal(e.message, 'kaboom');
        done();
      });
      mediator.publish(this.topics.getTopic('create'), {id: 'trever'});
    });
    it('should use result.id as a uid for request error calls', function(done) {
      this.topics.on('create', function() {
        var e = new Error('kaboom');
        e.id = 'trever'
        return Promise.reject(e);
      });
      this.topics.onError('create:trever', function(e) {
        assert.equal(e.message, 'kaboom');
        done();
      });
      mediator.publish(this.topics.getTopic('create'), {id: 'trever'});
    });
    it('should provide itself as context', function(done) {
      var topics = this.topics;
      this.topics.on('create', function() {
        assert.equal(this, topics);
        done();
      });
      mediator.publish(this.topics.getTopic('create'), {id: 'trever'});
    });
  });

  describe('#onDone', function() {
    it('should subscribe to a namespaced done: topic', function(done) {
      this.topics.onDone('create', function(user) {
        assert.equal(user.id, 'trever');
        done();
      });
      mediator.publish(this.topics.getTopic('create', 'done'), {id: 'trever'});
    });
    it('should provide itself as context', function(done) {
      var topics = this.topics;
      this.topics.onDone('create', function() {
        assert.equal(this, topics);
        done();
      });
      mediator.publish(this.topics.getTopic('create', 'done'), {id: 'trever'});
    });
  });

  describe('#onError', function() {
    it('should subscribe to a namespaced error: topic', function(done) {
      this.topics.onError('create', function(e) {
        assert.equal(e.message, 'kaboom');
        done();
      });
      mediator.publish(this.topics.getTopic('create', 'error'), new Error('kaboom'));
    });
    it('should provide itself as context', function(done) {
      var topics = this.topics;
      this.topics.onError('create', function() {
        assert.equal(this, topics);
        done();
      });
      mediator.publish(this.topics.getTopic('create', 'error'), new Error('kaboom'));
    });
  });

  describe('#request', function() {
    it('should request a namespaced topic', function(done) {
      this.topics.on('find', function() {
        return {id: 'trever'};
      });
      this.topics.request('find', 'trever').then(function(user) {
        assert.equal(user.id, 'trever');
        done();
      });
    });
  });
});