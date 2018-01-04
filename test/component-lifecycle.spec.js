const path = require('path');
const { initComponent, createTestSandbox } = require('../test-utils');

describe('component lifecycle', () => {
  const componentClass = initComponent(path.resolve(__dirname, './resources/multi-file-lifecycle/index.marko'));

  let testSandbox;
  let component;

  beforeEach(() => {
    testSandbox = createTestSandbox();
  });

  afterEach(() => {
    testSandbox.reset();
  });

  it('should trigger onMount', async () => {
    const spyOnMount = jest.spyOn(componentClass.Component.prototype, 'onMount');

    component = await testSandbox.renderComponent(componentClass, {});

    expect(spyOnMount).toHaveBeenCalled();

    spyOnMount.mockRestore();
  });

  it('should trigger onDestroy', async () => {
    const spyOnDestroy = jest.spyOn(componentClass.Component.prototype, 'onDestroy');
    component = await testSandbox.renderComponent(componentClass, {});
    component.destroy();

    expect(spyOnDestroy).toHaveBeenCalled();

    spyOnDestroy.mockRestore();
  });
});
