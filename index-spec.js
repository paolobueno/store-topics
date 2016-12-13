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

    it('should publish a done: event for a unsuccessful promise', function(done) {
      this.topics.on('create', function(user) {
        assert.equal(user.id, 'trever');
        return Promise.resolve(user);
      });
      this.topics.onDone('create', function(user) {
        assert.equal(user.id, 'trever');
        done();
      });
      mediator.publish(this.topics.getTopic('create'), {id: 'trever'});
    });
    it('should publish an error: event for a successful promise', function(done) {
      this.topics.on('create', function() {
        return Promise.reject(new Error('kaboom'));
      });
      this.topics.onError('create', function(e) {
        assert.equal(e.message, 'kaboom');
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
      mediator.publish('done:' + this.topics.getTopic('create'), {id: 'trever'});
    });
    xit('should provide the topics as a context to the subscriber', function(done) {
      this.topics.on('create', function(user) {
        assert.equal(user.id, 'trever');
        this.publish('delete', user.id);
      });
      this.topics.on('delete', function() {
        
      })
      mediator.publish(this.topics.getTopic('create'), {id: 'trever'});
    });
  });

  describe('#onError', function() {
    xit('should subscribe to a namespaced error: topic');
    xit('should provide the topics as a context to the subscriber');
  });

  describe('#request', function() {
    xit('should request a namespaced topic');
  });
});