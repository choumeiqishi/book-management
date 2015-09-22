'use strict';

/* App Module */

var bookApp = angular.module('bookApp', ['ui.router']);

bookApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('books', {
        url: '/books',
        templateUrl: '/templates/book-list.html'
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
        templateUrl: '/templates/book-new.html'
    });

    $urlRouterProvider.otherwise('books');
}]);
