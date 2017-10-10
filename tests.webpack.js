var context = require.context('./test', true, /.+\.spec\.js?$/);

require('core-js/es5');

context.keys().forEach(context);
module.exports = context;
