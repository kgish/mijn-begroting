/* eslint-env node */

module.exports = function(environment) {
    var ENV = {
        modulePrefix: 'accountability-hack',
        environment: environment,
        rootURL: '/',
        locationType: 'auto',
        EmberENV: {
            FEATURES: {
                // Here you can enable experimental features on an ember canary build
                // e.g. 'with-controller': true
            },
            EXTEND_PROTOTYPES: {
                // Prevent Ember Data from overriding Date.parse.
                Date: false
            }
        },

        APP: {
          // Here you can pass flags/options to your application instance
          // when it is created
          title: 'Mijn-Begroting'
        },

        apiHost: 'http://www.openspending.nl',
        apiNamespace: 'api/v1',

        googleFonts: [
            'Open+Sans:300,400,700',
            'Roboto:300'
        ],

        contentSecurityPolicy: {
            'default-src': "'none'",
            'script-src': "'self'",
            'font-src': "'self' fonts.gstatic.com",
            'connect-src': "'self' http://www.openspending.nl/",
            'img-src': "'self'",
            'style-src': "'self' fonts.googleapis.com",
            'media-src': "'self'"
        }
    };

    if (environment === 'development') {
        // ENV.APP.LOG_RESOLVER = true;
        // ENV.APP.LOG_ACTIVE_GENERATION = true;
        // ENV.APP.LOG_TRANSITIONS = true;
        // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
        // ENV.APP.LOG_VIEW_LOOKUPS = true;
    }

    if (environment === 'test') {
        // Testem prefers this...
        ENV.locationType = 'none';

        // keep test console output quieter
        ENV.APP.LOG_ACTIVE_GENERATION = false;
        ENV.APP.LOG_VIEW_LOOKUPS = false;

        ENV.APP.rootElement = '#ember-testing';
    }

    if (environment === 'production') {

        // Enable mirage to run on production server
        ENV['ember-cli-mirage'] = {
            enabled: true
        }
    }

    return ENV;
};
