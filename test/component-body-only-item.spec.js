const path = require('path');
const { init } = require('../');

const { render, cleanup } = init(path.resolve(__dirname, './resources/body-only-item/index.marko'));

describe('body-only component', () => {
  afterEach(cleanup);

  describe('on rendering body-only mode', () => {
    let renderResult;

    beforeEach(async () => {
      renderResult = await render({ showSpan: true, text: 'test' });
    });

    it('should render correctly', () => {
      expect(renderResult.getNodes()).toMatchSnapshot();
    });
  });

  describe('on rendering NON-body-only mode', () => {
    let renderResult;

    beforeEach(async () => {
      renderResult = await render({ showSpan: false, text: 'test' });
    });

    it('should update the element', () => {
      expect(renderResult.getNodes()).toMatchSnapshot();
    });
  });
});
