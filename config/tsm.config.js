const { define } = require('tsm/config');

module.exports = define({
  '.tsx': { loader: 'tsx' },
  '.css': { loader: 'text' },
  '.scss': { loader: 'text' },
  '.html': { loader: 'text' },
});
