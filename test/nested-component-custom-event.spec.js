const path = require('path');
const { init, cleanup } = require('../');

const { render } = init(path.resolve(__dirname, './resources/click-and-win/index.marko'));

describe('component with nested components', () => {
  const MODEL = {
    items: [
      { label: 'click me', value: 0 },
      { label: 'click me', value: 0 },
      { label: 'click me', value: 0 },
      { label: 'click me', value: 'win' },
      { label: 'click me', value: 0 }
    ]
  };
  let renderResult;
  let component;

  afterEach(cleanup);

  describe('given default model', () => {
    beforeEach(async () => {
      renderResult = await render(MODEL);
      ({ component } = renderResult);
    });

    it('should render correctly', () => {
      expect(renderResult.getNodes()).toMatchSnapshot();
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
