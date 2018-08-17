const path = require('path');
const { initComponent, createTestSandbox } = require('../test-utils');

describe('external-component', () => {
  const componentClass = initComponent(path.resolve(__dirname, './resources/external-component/index.marko'));

  let testSandbox;
  let component;

  beforeEach(() => {
    testSandbox = createTestSandbox();
  });

  afterEach(() => {
    testSandbox.reset();
  });

  describe('on rendering', () => {
    beforeEach(async () => {
      component = await testSandbox.renderComponent(componentClass, {});
    });

    it('should render correctly', () => {
      expect(testSandbox.getRenderedNodes()).toMatchSnapshot();
    });
  });

  describe('on triggering click handler', () => {
    beforeEach(async () => {
      component = await testSandbox.renderComponent(componentClass, {});

      component.el.click();
      component.update();
    });

    it('should update the element', () => {
      expect(testSandbox.getRenderedNodes()).toMatchSnapshot();
    });

    it('should change the button label', () => {
      const buttonLabel = component.el.textContent;
      expect(buttonLabel).toEqual('DONE');
    });
  });
});
