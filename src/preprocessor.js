const compiler = require('marko/compiler');

// Jest helper to compile Marko
module.exports = {
  process(src, filepath, jestCfg = {}) {
    const markoJestCfg = (jestCfg.globals && jestCfg.globals['marko-jest']) || {};

    let compileOption;
    const { taglibExcludePackages } = markoJestCfg;
    if (taglibExcludePackages) {
      taglibExcludePackages.forEach(pkg => compiler.taglibFinder.excludePackage(pkg));

      compileOption = { ignoreUnrecognizedTags: true };
    }

    // NOTE: need to render to vdom so rendering to JSDOM works
    const compiledSrc = compiler.compileFileForBrowser(filepath, compileOption);
    return compiledSrc;
  },
};
