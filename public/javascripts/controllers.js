'use strict';

/* Controllers */

var bookControllers = angular.module('bookControllers', ['bookServices']);

// menu nav controller
bookControllers.controller('NavController', ['$scope', function ($scope) {
    
}]);

// book list controller
bookControllers.controller('ListController', ['$scope', 'BookService', 'BookStatus', 'BookCategory', 
        function ($scope, BookService, BookStatus, BookCategory) {
    $scope.search = {};
    $scope.categoryList = BookCategory.list;
    $scope.statusList = BookStatus.list;
    $scope.books = BookService.books;

    $scope.getStars = function (count) {
        var arr = [];
        for (var i = 1; i <= count; i++) {
            arr.push(i);
        }
        return arr;
    };

    $scope.filterCategory = function (category) {
        if (category === 0) {
            $scope.search.category = undefined;
        } else {
            $scope.search.category = category;
        }

        angular.forEach($scope.categoryList, function(item) {
            item.selected = false;
        });
        this.category.selected = true;
    };

    $scope.filterStatus = function (status) {
        if (status === 0) {
            $scope.search.status = undefined;
        } else {
            $scope.search.status = status;
        }

        angular.forEach($scope.statusList, function(item) {
            item.selected = false;
        });
        this.status.selected = true;
    };
}]);