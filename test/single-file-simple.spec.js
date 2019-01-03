const path = require('path');
const { init, cleanup } = require('../');

const { render } = init(path.resolve(__dirname, './resources/single-file-simple/index.marko'));

describe('single-file component', () => {
  let renderResult;
  let component;

  afterEach(cleanup);

  describe('on rendering', () => {
    beforeEach(async () => {
      renderResult = await render({});
      ({ component } = renderResult);
    });

    it('should render the component as a button', () => {
      expect(component.el.matches('button')).toBeTruthy();
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

    it('should change the button label', () => {
      const buttonLabel = component.el.textContent;
      expect(buttonLabel).toEqual('DONE');
    });
  });
});
