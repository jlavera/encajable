'use strict';

module.exports = {
  buildWrapperFor
};

function buildWrapperFor(container, alias, _module) {
  const module  = _module();
  const wrapper = new Wrapper(module);

  let wrappedFunction;
  Object.keys(module).forEach(prop => {
    // Wrap functions
    if (typeof module[prop] === 'function') {
      wrappedFunction = (function (container, alias, funName) {
        return function() {
          container.unwrap(alias);
          return this.module[funName].apply(this, arguments);
        }
      })(container, alias, prop);
      wrapper[prop] = wrappedFunction;
      wrappedFunction.bind(wrapper);
    }
  });

  return wrapper;
}

function Wrapper(_module) {
  this.module = _module;
}
