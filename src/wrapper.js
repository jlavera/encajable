module.exports = {
  buildWrapperFor
};

function buildWrapperFor(module) {
  const wrapper = {};

  Object.keys(module()).forEach(prop => {
    // Wrap functions
    if (typeof module.prop === 'function') {
      wrapper[prop] = function () {
        // TODO load depenencies here
        return module.prop();
      };
    }
  });

  return wrapper;
}
