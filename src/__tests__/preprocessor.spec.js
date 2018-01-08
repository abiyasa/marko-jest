describe('preprocessor', () => {
  const mockedMarkoCompiler = {
    compileFile: jest.fn()
  };
  jest.mock('marko/compiler', () => mockedMarkoCompiler);

  // eslint-disable-next-line global-require
  const preprocessor = require('../preprocessor');

  it('should compile Marko file with ouput to vdom', () => {
    const filepath = 'src/file/path';
    preprocessor.process('source', filepath);
    expect(mockedMarkoCompiler.compileFile).toHaveBeenCalledWith(filepath, { output: 'vdom' });
  });
});
