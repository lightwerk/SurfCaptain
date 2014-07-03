/*jslint node: true */
/*global module*/
'use strict';
module.exports = {
    gruntfileJs: {
        files: ['Gruntfile.js', 'grunt/**/*.js'],
        tasks: ['withoutNewer'],
        options: {
            nospawn: true
        }
    },
    stylesheets: {
        files: ['Resources/Public/Stylesheets/SurfCaptain.less'],
        tasks: ['less'],
        options: {
            nospawn: true
        }
    },
    scripts: {
        files: [
            'Resources/Public/Scripts/SurfCaptainApp/**/*.js'
        ],
        tasks: ['concat', 'uglify', 'karma:unit:run'],
        options: {
            nospawn: true
        }
    }
};