// Karma configuration
// Generated on Thu Jul 03 2014 20:47:22 GMT+0200 (CEST)

module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: 'Resources/Public/',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            'Scripts/Libs.js',
            'Components/angular-mocks/angular-mocks.js',
            'Scripts/Main.js',
            'Scripts/SurfCaptainApp/Partials/*.html',
            'Scripts/SurfCaptainApp/Tests/Unit/**/*.js'
        ],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'Scripts/SurfCaptainApp/Partials/*.html': 'ng-html2js'
        },

        ngHtml2JsPreprocessor: {
            // strip the original path
            stripPrefix: 'Resources/Public/',
            // and prepend the flow location
            prependPrefix: '/_Resources/Static/Packages/Lightwerk.SurfCaptain/',

            // Load all partials with module(surfCaptainPartials)
            moduleName: 'surfCaptainPartials'
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    });
};
