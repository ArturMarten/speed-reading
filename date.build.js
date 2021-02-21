const replace = require('replace-in-file');

const buildDate = new Date().toISOString();
const options = {
  files: 'src/environment.js',
  from: /date: '(.*)'/g,
  to: `date: '${buildDate}'`,
  allowEmptyPaths: false,
};

try {
  const changedFiles = replace.sync(options);
  if (changedFiles === 0) {
    throw Error(`Please make sure that file ${options.files} has "date: "`);
  }
  console.log(`Build date set: ${buildDate}`);
} catch (error) {
  console.log('Error occurred:', error);
  throw error;
}
