/* eslint-env node */
const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
    var app = new EmberApp(defaults, {
        // Add options here
    });

    app.import('bower_components/tether/dist/js/tether.min.js');
    app.import('bower_components/bootstrap/dist/js/bootstrap.min.js');
    app.import('bower_components/moment/min/moment.min.js');

    app.import('vendor/accounting.min.js');

    app.import('vendor/d3.min.js');
    app.import('vendor/d3pie.min.js');

  return app.toTree();
};
