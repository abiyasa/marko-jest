const path = require('path');
const { initComponent, createTestSandbox } = require('../test-utils');

describe('component with custom event', () => {
  const componentClass = initComponent(path.resolve(__dirname, './resources/list-item/index.marko'));
  const MODEL = { label: 'one', value: 1 };

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
      component = await testSandbox.renderComponent(componentClass, MODEL);
    });

    it('should render correctly', () => {
      expect(component.els).toMatchSnapshot();
    });

    describe('when clicked', () => {
      let onSelect;

      beforeEach(async () => {
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
