/* App Module */

var bookApp = angular.module('bookApp', ['ui.router', 'bookControllers']);

bookApp.run(['$rootScope', '$state', '$stateParams', '$timeout', function($rootScope, $state, $stateParams, $timeout){
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    $rootScope.getStars = function (count) {
        var arr = [];
        for (var i = 1; i <= count; i++) {
            arr.push(i);
        }
        return arr;
    };
}]);

bookApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('books', {
        cache: false,
        url: '/books',
        templateUrl: '/templates/book-list.html',
        controller: 'ListController',
        resolve: {
            postPromise: ['BookService', function(BookService){
                return BookService.getAllBooks();
            }]
        }
    }).
    state('detail', {
        cache: false,
        url: '/books/{bookId}',
        templateUrl: '/templates/book-detail.html',
        controller: 'DetailController',
        resolve: {
            book: ['$stateParams', 'BookService', function($stateParams, BookService){
                return BookService.getBook($stateParams.bookId);
            }]
        }
    }).
    state('create', {
        cache: false,
        url: '/create',
        templateUrl: '/templates/book-new.html',
        controller: 'CreationController'
    }).
    state('statistics', {
        cache: false,
        url: '/statistics',
        templateUrl: '/templates/book-statistics.html',
        controller: 'StatisticsController',
        resolve: {
            postPromise: ['BookService', function(BookService){
                return BookService.getAllBooks();
            }]
        }
    }).
    state('login', {
        url: '/login',
        templateUrl: '/templates/login.html',
        controller: 'AuthController',
        onEnter: ['$state', 'auth', function ($state, auth) {
            if (auth.isLoggedIn()) {
                $state.go('books');
            }
        }]
    }).
    state('register', {
        url: '/register',
        templateUrl: '/templates/register.html',
        controller: 'AuthController',
        onEnter: ['$state', 'auth', function ($state, auth) {
            if (auth.isLoggedIn()) {
                $state.go('books');
            }
        }]
    });

    $urlRouterProvider.otherwise('books');
}]);
