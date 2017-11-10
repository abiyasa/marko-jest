/* eslint-env browser, jest */

// @see node_modules/marko/dist/components/package.json
const MARKO_MODULES_TO_MOCK = {
  '/components/beginComponent.js': '/components/beginComponent-browser.js',
  '/components/endComponent.js': '/components/endComponent-browser.js',
  '/components/helpers.js': '/components/helpers-browser.js',
  '/components/index.js': '/components/index-browser.js',
  '/components/init-components.js': '/components/init-components-browser.js',
  '/components/legacy/defineWidget-legacy.js': '/components/legacy/defineWidget-legacy-browser.js',
  '/components/registry.js': '/components/registry-browser.js',
  '/components/util.js': '/components/util-browser.js',
};

/* eslint global-require: 1 */
/* eslint import/no-dynamic-require: 1 */
exports.initComponent = function (componentFullPath) {
  // hijack marko/dist requires to load browser-side modules on server-side
  Object.keys(MARKO_MODULES_TO_MOCK).forEach((markoModule) => {
    jest.mock(`marko/dist/${markoModule}`, () => require.requireActual(`marko/dist/${MARKO_MODULES_TO_MOCK[markoModule]}`));
  });

  // require the component to test
  const component = require(componentFullPath);

  // init marko component
  require('marko/components').init();

  return component;
};

exports.createTestSandbox = function () {
  const el = document.createElement('div');
  el.id = 'test-sandbox';
  document.body.appendChild(el);

  return {
    el,

    /**
     * Render component into sandbox
     */
    renderComponent(component, input) {
      return component.render(input)
        .then((result) => {
          result.appendTo(this.el);
          return result.getComponent();
        });
    },

    /**
     * Remove test component from sandbox from DOM
     */
    reset() {
      document.body.removeChild(this.el);
    },
  };
};
