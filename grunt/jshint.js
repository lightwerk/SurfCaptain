/* global module,require */

(function () {
    'use strict';
    module.exports = {
        jshint: {
            options: {
                reporter: require('jshint-stylish'),
                jshintrc: true
            },
            src: ['Resources/Public/Scripts/SurfCaptainApp/**/*.js']
        }
    };
}());