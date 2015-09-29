'use strict';

/* App Module */

var bookApp = angular.module('bookApp', ['ui.router', 'bookControllers']);

bookApp.run(['$rootScope', '$state', '$stateParams', function($rootScope, $state, $stateParams){
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
}]);

bookApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('books', {
        cache: false,
        url: '/books',
        templateUrl: '/templates/book-list.html',
        controller: 'ListController'
    }).
    state('search', {
        url: '/search',
        templateUrl: '/templates/book-search.html'
    }).
    state('detail', {
        url: '/books/{bookId}',
        templateUrl: '/templates/book-detail.html'
        //controller: ''
    }).
    state('create', {
        url: '/create',
        templateUrl: '/templates/book-new.html',
        controller: 'CreationController'
    });

    $urlRouterProvider.otherwise('books');
}]);

