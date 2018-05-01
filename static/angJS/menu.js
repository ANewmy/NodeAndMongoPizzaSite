var app = angular.module('menuApp', []);
app.controller('menuCtrl', function($scope, $http, $window) {
    // Q1) add two more pizza objects
    $http({
        method: 'GET',
        url: '/menu',
    }).then(
        function successCallback(response) {
            console.log('menu.js: get response: ', response);
            $scope.menu = response.data;
        },
        function errorCallback(response) {
            $scope.menu = [];
        },
    );

    $scope.msg = 'Menu';

    $scope.updateMenu = function(item) {
        $http({
            method: 'POST',
            url: '/updateMenu',
            data: item,
        }).then(
            function successCallback(response) {
                $scope.msg = 'Updated the Menu!';
            },
            function errorCallback(response) {
                $scope.menu = [];
            },
        );
    };
});
