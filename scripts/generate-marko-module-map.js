const glob = require('glob');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const fileExistsAsync = promisify(fs.exists);
const NODE_MODULES_PATH = './node_modules';
const MARKO_DIST = 'marko/dist';
const BASE_PATH = `${NODE_MODULES_PATH}/${MARKO_DIST}`;
const OUTPUT_PATH = './src/marko-modules-mocking-map.json';

/**
 * Generates mapping for Marko dependecies, so
 * Jest can load the browser-side dependencies on server
 */
(async function main() {
  try {
    const files = await getPackageFiles();
    const browserMaps = await Promise.all(files.map(processPackageFile));
    const mergedMap = browserMaps.filter(notNull).reduce((curr, browserMap) => {
      return Object.assign(curr, browserMap);
    }, {});
    const resultMap = await filterExistingFiles(mergedMap);

    console.log('Generated module mocking map:');
    console.log(JSON.stringify(resultMap, null, 2));

    await writeJSONFile(OUTPUT_PATH, resultMap);
  } catch (err) {
    console.error('ERROR on generating map:', err);
  }
})();

// recursively gets list of all package.json inside marko/dist
function getPackageFiles() {
  const options = {};

  return new Promise((resolve, reject) => {
    glob(`${BASE_PATH}/**/package.json`, {}, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
}

// process package.json, looking for browser field
async function processPackageFile(packageFile) {
  const text = await readFileAsync(packageFile, { encoding: 'utf8' });
  const contentJSON = JSON.parse(text);

  if (contentJSON.browser) {
    const key = packageFile.replace(BASE_PATH, MARKO_DIST).replace('/package.json', '');

    return flattenBrowserMap(key, contentJSON.browser);
  } else {
    return null;
  }
}

/**
 * Flatten browser map from:
 *
 * "marko/dist/runtime": {
 *   "./nextTick": "./nextTick-browser.js",
 *   "./index.js": "./index-browser.js"
 * }
 *
 * to:
 *
 * {
 *   "marko/dist/runtime/nextTick": "marko/dist/runtime/nextTick-browser.js",
 *   "marko/dist/runtime/index.js": "marko/dist/runtime/index-browser.js"
 * }
 * @param {*} folderName
 * @param {*} browserMap
 */
function flattenBrowserMap(folderName, browserMap) {
  return Object.keys(browserMap).reduce((curr, mapKey) => {
    const mockSource = path.join(folderName, mapKey);
    const mockTarget = path.join(folderName, browserMap[mapKey]);

    // ensure both mock source & target files are existed
    return Object.assign(curr, {
      [mockSource]: mockTarget
    });
  }, {});
}

// filter map key-value, make sure both files defined in key & value are existed
async function filterExistingFiles(browserMap) {
  const existingModules = await Promise.all(Object.keys(browserMap).map(async mapKey => {
    const targetModule = path.join(NODE_MODULES_PATH, mapKey);
    const mockModule = path.join(NODE_MODULES_PATH, browserMap[mapKey]);

    // ensure both mock source & target files are existed
    const isTargeFileExisted = await fileExistsAsync(targetModule);
    const isMockFileExisted = await fileExistsAsync(mockModule);
    console.log(targetModule);
    console.log(mockModule);
    console.log(`Both files exist: ${isTargeFileExisted && isMockFileExisted ? '✅' : '❌'}`);
    return (isTargeFileExisted && isMockFileExisted) && ({
      [mapKey]: browserMap[mapKey]
    });
  }));

  return existingModules.filter(module => !!module).reduce((curr, browserMap) => {
    return Object.assign(curr, browserMap);
  }, {});
}

// write JSON file
function writeJSONFile(targetFilename, data) {
  return writeFileAsync(targetFilename, JSON.stringify(data, null, 2));
}

function notNull(item) {
  return !!item;
}
