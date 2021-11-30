const { define } = require('tsm/config');

module.exports = define({
  '.tsx': { loader: 'tsx', banner: 'const React = require(\'react\');' },
  '.css': { loader: 'text' },
  '.scss': { loader: 'text' },
  '.html': { loader: 'text' },
});
