/**
 * Warn view model
 */

var app = app || {};

app.Warn = (function () {
    'use strict';

    var warnViewModel = (function () {

                
        var show = function () {
            $('#user-greeting-warn').text('Welcome, ' + app.currentUser.data.DisplayName + '!');
        };

        var logout = function () {
            navigator.notification.confirm('Do you really want to exit?', function (confirmed) {
                
                if (confirmed === true || confirmed === 1) {
                    app.currentUser = kendo.observable({ data: null });
                    app.helper.logout();
                    app.mobileApp.navigate('views/login.html');
                };

                var exit = function () {
                    navigator.app.exitApp();
                };

            }, 'Exit', ['OK', 'Cancel']);
        };

        return {
            show: show,
            logout: logout
        };

    }());

    return warnViewModel;
}());