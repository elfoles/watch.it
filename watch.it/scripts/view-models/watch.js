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

        var imagesOptions = [{ id: 1, name: 'All' }, { id: 2, name: 'My sites' }];

        var imagesDataList = [];

        var imagesData = (function () {
            var images = app.everlive.Files;

            images.get()
                .then(function (data) {
                    for (var i = 0; i < data.result.length; i++) {
                        imagesDataList.push(data.result[i]);
                    }
                },
                function (error) {
                    console.log(JSON.stringify(error));
                });
        }());
        
        var selectionImagesList = function (event) {
            var selectedValue = parseInt(event.target.value),
                template = kendo.template($("#imagesTemplate").html()),
                filteredData = [];

            switch(selectedValue) {
                case 1:
                    filteredData = imagesDataList.filter(function (element) {
                        return element;
                    });
                    break;
                case 2:
                    filteredData = imagesDataList.filter(function (element) {
                        return element.Owner === app.currentUser.data.Id;
                    });
                    break;
                default:
                    filteredData = imagesDataList.filter(function (element) {
                        return element;
                    });
                    break;

            }

            $("#imagesList").html(kendo.render(template, filteredData));
        }

        return {
            show: show,
            logout: logout,
            selectionImagesList: selectionImagesList,
            imagesOptions: imagesOptions,
            imagesDataList: imagesDataList
        };

    }());

    return watchViewModel;

}());