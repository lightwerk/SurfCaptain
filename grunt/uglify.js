/*jslint node: true */
/*global module*/
'use strict';
module.exports = {
    angular: {
        files: {
            'Resources/Public/Scripts/Main.min.js': ['Resources/Public/Scripts/Main.js']
        },
        options: {
            mangle: true
        }
    },
    libs: {
        files: {
            'Resources/Public/Scripts/Libs.min.js': ['Resources/Public/Scripts/Libs.js']
        },
        options: {
            mangle: true
        }
    }
};