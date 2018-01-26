const path = require('path');
const { initComponent, createTestSandbox } = require('../test-utils');

describe('component with custom methods', () => {
  const componentClass = initComponent(path.resolve(__dirname, './resources/fake-video/index.marko'));

  let testSandbox;
  let component;

  beforeEach(async () => {
    testSandbox = createTestSandbox();
    component = await testSandbox.renderComponent(componentClass, {});
  });

  afterEach(() => {
    testSandbox.reset();
  });

  it('should render properly', () => {
    expect(component.els).toMatchSnapshot();
  });

  it('should able to call its method from the component instance', async () => {
    component.playVideo();
    component.update();
    expect(component.els).toMatchSnapshot();

    component.stopVideo();
    component.update();
    expect(component.els).toMatchSnapshot();
  });
});
