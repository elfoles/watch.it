/**
 * Signup view model
 */
var app = app || {};

app.Watch = (function () {
    'use strict';
    
    var watchViewModel = (function () {
        'use strict';
        
        var show = function () {
            $('#user-greeting-watch').text('Welcome, ' + app.currentUser.data.DisplayName + '!');
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

    return watchViewModel;

}());