const path = require('path');
const { init, cleanup } = require('../');

const { componentClass, render } = init(path.resolve(__dirname, './resources/multi-file-lifecycle/index.marko'));

describe('component lifecycle', () => {
  afterEach(cleanup);

  it('should trigger onMount', async () => {
    const spyOnMount = jest.spyOn(componentClass.prototype, 'onMount');
    await render({});

    expect(spyOnMount).toHaveBeenCalled();

    spyOnMount.mockRestore();
  });

  it('should trigger onDestroy', async () => {
    const spyOnDestroy = jest.spyOn(componentClass.prototype, 'onDestroy');
    const { component } = await render({});
    component.destroy();

    expect(spyOnDestroy).toHaveBeenCalled();

    spyOnDestroy.mockRestore();
  });
});
