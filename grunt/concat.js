/*jslint node: true */
/*global module*/
'use strict';
module.exports = {
    options: {
        separator: '\r\n'
    },
    development: {
        src: [
            // First include instantiation of new angular model
            'Resources/Public/Scripts/SurfCaptainApp/SurfCaptainApp.js',
            // and after that the rest
            'Resources/Public/Scripts/SurfCaptainApp/**/*.js'
        ],
        dest: 'Resources/Public/Scripts/Main.js'
    }
};