const path = require('path');
const { initComponent, createTestSandbox } = require('../test-utils');

describe('body-only component', () => {
  const componentClass = initComponent(path.resolve(__dirname, './resources/body-only-item/index.marko'));

  let testSandbox;

  beforeEach(() => {
    testSandbox = createTestSandbox();
  });

  afterEach(() => {
    testSandbox.reset();
  });

  describe('on rendering body-only mode', () => {
    beforeEach(async () => {
      await testSandbox.renderComponent(componentClass, { showSpan: true, text: 'test' });
    });

    it('should render correctly', () => {
      expect(testSandbox.getRenderedNodes()).toMatchSnapshot();
    });
  });

  describe('on rendering NON-body-only mode', () => {
    beforeEach(async () => {
      await testSandbox.renderComponent(componentClass, { showSpan: false, text: 'test' });
    });

    it('should update the element', () => {
      expect(testSandbox.getRenderedNodes()).toMatchSnapshot();
    });
  });
});
