// public/js/appRoutes.js
angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

        // home page
        .when('/', {
            templateUrl: 'views/home.html',
            controller: 'KeywordController'
        })

        // route for list keywords
        .when('/keywords', {
            templateUrl: 'views/keyword.html',
            controller: 'KeywordController'
        });

    $locationProvider.html5Mode(true);

}]);


