jest.mock('marko/compiler');

const compiler = require('marko/compiler');
const preprocessor = require('../preprocessor');

describe('preprocessor', () => {
  beforeEach(() => {
    compiler.compileFileForBrowser = jest.fn();
  });

  afterEach(() => {
    compiler.compileFileForBrowser.mockRestore();
  });

  it('should compile Marko file', () => {
    const filepath = 'src/file/path';

    preprocessor.process('source', filepath);
    expect(compiler.compileFileForBrowser).toHaveBeenCalledWith(filepath, undefined);
  });

  describe('given taglibExcludePackages is defined', () => {
    const filepath = 'src/file/path';
    const jestConfig = {
      globals: {
        'marko-jest': {
          taglibExcludePackages: [
            '@ebay/ebayui-core',
            'material-marko'
          ]
        }
      }
    };

    beforeEach(() => {
      compiler.taglibFinder.excludePackage = jest.fn();

      preprocessor.process('source', filepath, jestConfig);
    });

    afterEach(() => {
      compiler.taglibFinder.excludePackage.mockRestore();
    });

    it('should register excluded packages to marko compiler', () => {
      expect(compiler.taglibFinder.excludePackage).toHaveBeenCalledTimes(2);

      const { calls } = compiler.taglibFinder.excludePackage.mock;
      expect(calls).toEqual([['@ebay/ebayui-core'], ['material-marko']]);
    });

    it('should compile Marko file with the right compiler option', () => {
      expect(compiler.compileFileForBrowser).toHaveBeenCalledWith(
        filepath,
        { ignoreUnrecognizedTags: true }
      );
    });
  });
});
