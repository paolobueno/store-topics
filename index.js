function Topics(mediator) {
  this.mediator = mediator;
  this.subscriptions = {};
}

Topics.prototype.prefix = function(prefix) {
  this.prefix = prefix;
  return this;
};

Topics.prototype.entity = function(entity) {
  this.entity = entity;
  return this;
};

Topics.prototype.addSubscription = function(topic, fn) {
  this.subscriptions[topic] = this.mediator.subscribe(topic, fn);
};

Topics.prototype.getTopic = function(topicName, prefix) {
  // create => wfm:user:create
  var parts = [this.prefix, this.entity, topicName];
  if (prefix) {
    parts.unshift(prefix);
  }
  return parts.join(':');
};

Topics.prototype.on = function(method, fn) {
  var topic = this.getTopic(method);
  var self = this;
  var wrappedFn = function() {
    Promise.resolve(fn.apply(self, arguments)).then(function(result) {
      self.mediator.publish(self.getTopic(method, 'done'), result);
      return result;
    }).catch(function(error) {
      self.mediator.publish(self.getTopic(method, 'error'), error);
    });
  };
  this.addSubscription(topic, wrappedFn);
};

Topics.prototype.onDone = function(method, fn) {
  var topic = this.getTopic(method, 'done');
  this.addSubscription(topic, fn);
  return this;
};

Topics.prototype.onError = function(method, fn) {
  var topic = this.getTopic(method, 'error');
  this.addSubscription(topic, fn);
  return this;
};

Topics.prototype.unsubscribeAll = function() {
  var subId;
  for(var topic in this.subscriptions) {
    if (this.subscriptions.hasOwnProperty(topic)) {
      subId = this.subscriptions[topic].id;
      this.mediator.remove(topic, subId);
    }
  }
};

Topics.prototype.request = function(topic, params, options) {
};

module.exports = Topics;