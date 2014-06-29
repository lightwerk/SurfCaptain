/*jslint node: true */
/*global module*/
'use strict';
module.exports = {
    development: {
        options: {
            relativeUrls: true
        },
        files: {
            'Resources/Public/Stylesheets/Main.css': 'Resources/Public/Stylesheets/Main.less'
        }
    },
    production: {
        options: {
            compress: true,
            yuicompress: true,
            optimization: 2,
            relativeUrls: true,
            cleancss: true
        },
        files: {
            'Resources/Public/Stylesheets/Main.min.css': 'Resources/Public/Stylesheets/Main.less'
        }
    }
};