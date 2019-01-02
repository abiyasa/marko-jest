const path = require('path');
const { init } = require('../');

const { render, cleanup } = init(path.resolve(__dirname, './resources/list-item/index.marko'));

describe('component with custom event', () => {
  const MODEL = { label: 'one', value: 1 };
  let renderResult;
  let component;

  afterEach(cleanup);

  describe('on rendering', () => {
    beforeEach(async () => {
      renderResult = await render(MODEL);
    });

    it('should render correctly', () => {
      expect(renderResult.getNodes()).toMatchSnapshot();
    });

    describe('when clicked', () => {
      let onSelect;

      beforeEach(() => {
        ({ component } = renderResult);
        onSelect = jest.fn();
        component.on('select', onSelect);

        component.el.click();
      });

      afterEach(() => {
        component.removeListener('select', onSelect);
      });

      it('should emit custom event with the right parameter', () => {
        expect(onSelect).toHaveBeenCalledWith(1);
      });
    });
  });
});
