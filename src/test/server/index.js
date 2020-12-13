if (process.env.NODE_ENV === 'development') {
  module.exports = require('./test-server');
} else if (process.env.NODE_ENV === 'test') {
  module.exports = require('./test-server');
} else {
  module.exports = require('./test-server');
}
