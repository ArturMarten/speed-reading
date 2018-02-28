const replace = require('replace-in-file');
const packageJson = require('./package.json');

const buildVersion = packageJson.version;
const options = {
  files: 'src/environment.js',
  from: /version: '(.*)'/g,
  to: `version: '${buildVersion}'`,
  allowEmptyPaths: false,
};

try {
  const changedFiles = replace.sync(options);
  if (changedFiles === 0) {
    throw Error(`Please make sure that file ${options.files} has "version: "`);
  }
  console.log(`Build version set: ${buildVersion}`);
} catch (error) {
  console.log('Error occurred:', error);
  throw error;
}
