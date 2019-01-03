const path = require('path');
const { init, cleanup } = require('../');

const { render } = init(path.resolve(__dirname, './resources/single-file-styled/index.marko'));

describe('single-file with styled component', () => {
  let renderResult;
  let component;

  afterEach(cleanup);

  describe('on rendering', () => {
    beforeEach(async () => {
      renderResult = await render({});
    });

    it('should render correctly', () => {
      expect(renderResult.getNodes()).toMatchSnapshot();
    });
  });

  describe('on triggering click handler', () => {
    beforeEach(async () => {
      renderResult = await render({});
      ({ component } = renderResult);

      component.el.click();
      component.update();
    });

    it('should update the element', () => {
      expect(renderResult.getNodes()).toMatchSnapshot();
    });
  });
});
