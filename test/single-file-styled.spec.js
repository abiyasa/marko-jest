const path = require('path');
const { initComponent, createTestSandbox } = require('../test-utils');

describe('single-file with styled component', () => {
  const componentClass = initComponent(path.resolve(__dirname, './resources/single-file-styled/index.marko'));

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
      expect(component.els).toMatchSnapshot();
    });
  });

  describe('on triggering click handler', () => {
    beforeEach(async () => {
      component = await testSandbox.renderComponent(componentClass, {});

      component.el.click();
      component.update();
    });

    it('should update the element', () => {
      expect(component.els).toMatchSnapshot();
    });
  });
});
