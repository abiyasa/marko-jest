/* eslint-env browser, jest */

const { createTestSandbox } = require('../test-utils');

describe('test-utils', () => {
  describe('test sandbox', () => {
    describe('on creating one with createTestSandbox()', () => {
      let testSandbox;

      beforeAll(() => {
        testSandbox = createTestSandbox();
      });

      afterAll(() => {
        testSandbox.reset();
      });

      it('should create a test sandbox element ', () => {
        expect(testSandbox.el).toBeDefined();
        expect(testSandbox.el.id).toContain('test-sandbox');
      });

      it('should add the test sandbox element to the DOM', () => {
        expect(document.body.contains(testSandbox.el)).toBeTruthy();
      });
    });

    describe('on removing one', () => {
      it('should remove the test sandbox element from the DOM ', () => {
        const testSandbox = createTestSandbox();
        expect(document.body.contains(testSandbox.el)).toBeTruthy();

        testSandbox.reset();
        expect(document.body.contains(testSandbox.el)).not.toBeTruthy();
      });

      it('should remove all elements inside the test sandbox element', () => {
        const testSandbox = createTestSandbox();

        testSandbox.el.innerHTML = `
          <div>Test1</div>
          <div>Test2</div>
          <div>Test3</div>
        `;
        expect(testSandbox.el.innerHTML).not.toEqual('');

        testSandbox.reset();
        expect(testSandbox.el.innerHTML).toEqual('');
      });
    });
  });
});
