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
            'Resources/Public/Scripts/SurfCaptainApp/**/*.js',
            '!Resources/Public/Scripts/SurfCaptainApp/Tests/**/*.js'
        ],
        dest: 'Resources/Public/Scripts/Main.js'
    },
    libs: {
        src: [
            'Resources/Public/Components/jquery/dist/jquery.js',
            'Resources/Public/Components/chosen/chosen.jquery.js',
            'Resources/Public/Components/bootstrap/js/tooltip.js',
            'Resources/Public/Components/bootstrap/js/modal.js',
            'Resources/Public/Components/bootstrap/js/tab.js',
            'Resources/Public/Components/angular/angular.js',
            'Resources/Public/Components/angular-route/angular-route.js',
            'Resources/Public/Components/angular-animate/angular-animate.js',
            'Resources/Public/Components/AngularJS-Toaster/toaster.js',
            'Resources/Public/Components/ng-biscuit/dist/ng-biscuit.js',
            'Resources/Public/Components/angular-messages/angular-messages.js',
            'Resources/Public/Components/angular-xeditable/dist/js/xeditable.js'
        ],
        dest: 'Resources/Public/Scripts/Libs.js'
    }
};