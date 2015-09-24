'use strict';

/* Controllers */

var bookControllers = angular.module('bookControllers', ['bookServices']);

// menu nav controller
bookControllers.controller('NavController', ['$scope', function($scope){
    
}]);

// book list controller
bookControllers.controller('ListController', ['$scope', 'BookService', function($scope, BookService){
    $scope.books = BookService.books;
    $scope.getStars = function(count){
        var arr = [];
        for (var i = 1; i <= count; i++) {
            arr.push(i);
        }
        return arr;
    };
}]);