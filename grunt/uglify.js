/*jslint node: true */
/*global module*/
'use strict';
module.exports = {
    production: {
        files: {
            'Resources/Public/Scripts/Main.min.js': ['Resources/Public/Scripts/Main.js']
        },
        options: {
            mangle: false
        }
    }
};