/*jslint node: true */
/*global module*/
'use strict';
module.exports = {
    stylesheets: {
        files: ['Resources/Public/Stylesheets/**/*.less'],
        tasks: ['less'],
        options: {
            nospawn: true
        }
    },
    scripts: {
        files: [
            'Resources/Public/Scripts/SurfCaptainApp/**/*.js'
        ],
        tasks: ['concat', 'ngAnnotate', 'uglify:angular'],
        options: {
            nospawn: true
        }
    }
};