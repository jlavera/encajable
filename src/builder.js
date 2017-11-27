const wrapperBuilder = require('./wrapper');

module.exports = {
  createBuilder
};

// -- Builder

function createBuilder() {
  return new Builder();
}

function Builder() {
  const dependencies = {};

  Builder.prototype.register = function (alias, dependency, isEager) {
    // Check existence
    if (dependencies[alias]) {
      console.warn(`There is alreay a dependency registered under the alias ${alias}. It will be replaced.`);
    }

    dependencies[alias] = {
      dependencies: dependency.slice(0, -1),
      module:       dependency.slice(-1)[0],
      isEager:      isEager
    };

    return this;
  }

  Builder.prototype.unregister = function (alias) {
    delete dependencies[alias];
  }

  // TODO implement cyclic reference control!
  Builder.prototype.build = function build() {
    // Validate existence of all required dependencies
    Object.keys(dependencies).forEach(depName => {
      dependencies[depName].dependencies.forEach(required => {
        if (!dependencies[required]) {
          throw `Missing dependency ${required} for ${depName}.`;
        }
      })
    });

    return new Container(dependencies);
  }
}

// -- Container

function Container(_dependencies) {
  const dependencies = _dependencies;
  const self         = this;

  Container.prototype.get = function (alias) {
    const dep = dependencies[alias];

    // If it's been already built
    if (dep.resolved) {
      return dep.resolved;
    }

    // If it should be resolved eagerly
    if (dep.isEager) {
      return dep.resolved = dep.module.bind.apply(dep.module, [null].concat(dep.dependencies.map(self.get)))();
    }

    const module = dep.module.bind.apply(dep.module, [null].concat(dep.dependencies.map(self.get)));
    return dep.resolved = wrapperBuilder.buildWrapperFor(self, alias, module);
  }

  Container.prototype.unwrap = function (alias) {
    dependencies[alias].resolved = dependencies[alias].resolved.module;
  }

  Container.prototype.getDependencies = function () {
    return dependencies;
  }
}
