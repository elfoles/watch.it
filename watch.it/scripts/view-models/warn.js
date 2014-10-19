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
        
        
        var currentLocation = function() {
            var options = {
                    enableHighAccuracy: true
                },
                currentPosition = {};


            var locator = navigator.geolocation.getCurrentPosition(onSuccess, onError, options);

            // onSuccess Geolocation
            function onSuccess(position) {
                currentPosition.latitude = position.coords.latitude;
                currentPosition.longitude = position.coords.longitude;

                return true;
            }

            // onError Callback receives a PositionError object
            function onError(error) {
                alert('code: ' + error.code + '\n' +
                    'message: ' + error.message + '\n');
                return false;
            }

            if (locator) {
                return currentPosition;
            } else {
                return false;
            }
        };
        
        var isLocationValidSite = function (location) {
            var dist = 0.01;
            var result;

            var sites = app.everlive.data('Locations');
            result = sites.get().then(function (data) {

                for (var i = 0; i < data.result.length; i++) {
                    if (Math.abs(data.result[i].Location.longitude-location.longitude)<dist && Math.abs(data.result[i].Location.latitude - location.latitude)<dist) {
                        return true;
                    }
                }

                return false;
            });


            if (result) {
                return true;
            }

            navigator.notification.alert("This is not a site from \nthe 100 national tourist sites.\nThe photo will not be added.");
            navigator.notification.vibrate(1000);
            return false;
        };
        
        

        return {
            show: show,
            logout: logout
        };

    }());

    return warnViewModel;
}());