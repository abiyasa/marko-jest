const path = require('path');
const { init } = require('../');

const { render, cleanup } = init(path.resolve(__dirname, './resources/fake-video/index.marko'));

describe('component with custom methods', () => {
  let renderResult;

  beforeEach(async () => {
    renderResult = await render({});
  });

  afterEach(cleanup);

  it('should render properly', () => {
    expect(renderResult.getNodes()).toMatchSnapshot();
  });

  it('should able to call its method from the component instance', async () => {
    const { component } = renderResult;

    component.playVideo();
    component.update();
    expect(renderResult.getNodes()).toMatchSnapshot();

    component.stopVideo();
    component.update();
    expect(renderResult.getNodes()).toMatchSnapshot();
  });
});
