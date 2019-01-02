/* eslint-env browser */
const path = require('path');
const { init } = require('../');

describe('init()', () => {
  describe('given a path to Marko component', () => {
    const { render, cleanup } = init(path.resolve(__dirname, './resources/single-file-simple/index.marko'));

    it('should create and remove test container using render() and cleanup()', async () => {
      const renderResult = await render({});
      expect(renderResult.container.id).toEqual(expect.stringContaining('marko-jest-sandbox'));
      expect(document.body.contains(renderResult.container)).toBe(true);

      cleanup();
      expect(document.body.contains(renderResult.container)).toBe(false);
    });
  });
});
