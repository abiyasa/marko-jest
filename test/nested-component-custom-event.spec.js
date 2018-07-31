const path = require('path');
const { initComponent, createTestSandbox } = require('../test-utils');

describe('component with nested components', () => {
  const componentClass = initComponent(path.resolve(__dirname, './resources/click-and-win/index.marko'));
  const MODEL = {
    items: [
      { label: 'click me', value: 0 },
      { label: 'click me', value: 0 },
      { label: 'click me', value: 0 },
      { label: 'click me', value: 'win' },
      { label: 'click me', value: 0 }
    ]
  };

  let testSandbox;
  let component;

  beforeEach(() => {
    testSandbox = createTestSandbox();
  });

  afterEach(() => {
    testSandbox.reset();
  });

  describe('given default model', () => {
    beforeEach(async () => {
      component = await testSandbox.renderComponent(componentClass, MODEL);
    });

    it('should render correctly', () => {
      expect(testSandbox.getRenderedNodes()).toMatchSnapshot();
    });

    it('should able to get nested element with getEl()', () => {
      const el = component.getEl('title');
      expect(el).toBeDefined();
    });

    it('should able to get nested components with getComponents()', () => {
      const buttons = component.getComponents('secret-item');
      expect(buttons).toHaveLength(MODEL.items.length);
    });

    it('should able to get a nested component with getComponent()', () => {
      const video = component.getComponent('award-video');
      expect(video).toBeDefined();
    });
  });
});
