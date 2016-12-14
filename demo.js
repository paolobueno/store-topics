var ArrayStore = require('fh-wfm-mediator/lib/array-store');
var Topics = require('./index');

var mediator = require('fh-wfm-mediator/lib/mediator');
var store = new ArrayStore('user', require('./fixtures.json'));
var topics = new Topics(mediator)
  .prefix('wfm:cloud')
  .entity('user')
  .on('create', store.create.bind(store))
  .on('read', store.read.bind(store))
  .on('update', store.update.bind(store))
  .on('list', store.list.bind(store))
  .on('delete', store.delete.bind(store));

topics.request('read', 'rkX1fdSH')
 .then(console.log)
 .catch(console.error);

topics.request('list')
  .then(items => items.map(i => i.username))
  .then(console.log)
  .catch(console.error);