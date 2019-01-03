const path = require('path');
const { init, cleanup } = require('../');

const { render } = init(path.resolve(__dirname, './resources/external-component/index.marko'));

describe('external-component', () => {
  let renderResult;

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
    let component;

    beforeEach(async () => {
      renderResult = await render({});
      ({ component } = renderResult);

      component.el.click();
      component.update();
    });

    it('should update the element', () => {
      expect(renderResult.getNodes()).toMatchSnapshot();
    });

    it('should change the button label', () => {
      const buttonLabel = component.el.textContent;
      expect(buttonLabel).toEqual('DONE');
    });
  });
});
