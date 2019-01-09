/* eslint-env browser */
const path = require('path');
const { init, cleanup } = require('../');

describe('init()', () => {
  describe('given a path to Marko component', () => {
    const { render } = init(path.resolve(__dirname, './resources/single-file-simple/index.marko'));

    it('should create a test container using render()', async () => {
      const renderResult = await render({});
      expect(renderResult.container.id).toEqual(expect.stringContaining('marko-jest-sandbox'));
      expect(document.body.contains(renderResult.container)).toBe(true);
    });

    it('should remove all test containers with cleanup()', async () => {
      const renderResult = await render({});
      expect(renderResult.container.id).toEqual(expect.stringContaining('marko-jest-sandbox'));
      expect(document.body.contains(renderResult.container)).toBe(true);

      cleanup();
      expect(document.body.contains(renderResult.container)).toBe(false);
    });
  });
});
