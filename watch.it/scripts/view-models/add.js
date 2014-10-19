/* global kendo, window */

var app = app || {};

app.Add = (function () {
    'use strict';

    var addViewModel = (function () {
        
        
        var show = function () {
            $('#user-greeting').text('Welcome, ' + app.currentUser.data.DisplayName + '!');
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

        var addPhoto = function() {
            if (app.isConnected()) {
                var text = /*app.currentUser.data.DisplayName +*/ " visited " + "Cherni vruh";

                var location = currentLocation();

                if (isLocationValidSite(location)) {
                    var success = function(data) {
                        app.everlive.Files.create({
                            Filename: Math.random().toString(36).substring(2, 15) + ".jpg",
                            ContentType: "image/jpeg",
                            base64: data,
                            Longitude: location.longitude,
                            Latitude: location.latitude,
                            Text: text
                        });
                    };

                    var error = function() {
                        app.showAlert("Unfortunately we could not add the image");
                    };

                    var config = {
                        destinationType: Camera.DestinationType.DATA_URL,
                        targetHeight: 400,
                        targetWidth: 400
                    };

                    //navigator.camera.Direction(0);
                    navigator.camera.getPicture(success, error, config);
                }
            }
        };
        
        var categoryOptions = [{ id: 1, name: 'Asphalt' }, { id: 2, name: 'Buildings' }];

        var transportationOptions = [{ id: 1, name: 'Pedestrian' }, { id: 2, name: 'Cyclist' }, { id: 3, name: 'Motor-Cyclist' }, { id: 4, name: 'Driver' }];

        return {
            show: show,
            logout: logout,
            addPhoto: addPhoto,
            categoryOptions: categoryOptions,
            transportationOptions : transportationOptions
        };

    }());

    return addViewModel;
}());