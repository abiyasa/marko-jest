const glob = require('glob');
const { promisify } = require('util');
const fs = require('fs');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const MARKO_DIST = 'marko/dist';
const BASE_PATH = `./node_modules/${MARKO_DIST}`;
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

    console.log('Generated module mocking map:');
    console.log(JSON.stringify(mergedMap, null, 2));

    await writeJSONFile(OUTPUT_PATH, mergedMap);
  } catch (err) {
    console.error('ERROR on generating map:', err);
  }
})();

// recursively gets all package.json inside marko/dist
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

// process package.json, looking for browser part
async function processPackageFile(packageFile) {
  const text = await readFileAsync(packageFile, { encoding: 'utf8' });
  const contentJSON = JSON.parse(text);

  if (contentJSON.browser) {
    const key = packageFile.replace(BASE_PATH, MARKO_DIST).replace('/package.json', '');

    return {
      [key]: contentJSON.browser
    };
  } else {
    return null;
  }
}

// write JSON file
function writeJSONFile(targetFilename, data) {
  return writeFileAsync(targetFilename, JSON.stringify(data, null, 2));
}

function notNull(item) {
  return !!item;
}
