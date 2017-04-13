const builder = require('./src/builder');

const container = builder.createBuilder()
  .register('dep0', require('./examples/usage'), true)
  .register('dep1', require('./examples/dep1'), true)
  .register('dep2', require('./examples/dep2'), true)
  .build()
;

// console.log(container.getDependencies());

// console.log(container.get('dep0'));
container.get('dep0').cosas();
