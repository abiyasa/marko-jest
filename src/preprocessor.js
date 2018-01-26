const compiler = require('marko/compiler');

// Jest helper to compile Marko
module.exports = {
  process(src, filepath) {
    // NOTE: need to render to vdom so rendering to JSDOM works
    const compiledSrc = compiler.compileFileForBrowser(filepath);
    return compiledSrc;
  },
};
