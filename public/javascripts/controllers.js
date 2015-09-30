'use strict';

/* Controllers */

var bookControllers = angular.module('bookControllers', ['bookServices']);

// menu nav controller
bookControllers.controller('NavController', ['$scope', function ($scope) {
    
}]);

// book list controller
bookControllers.controller('ListController', ['$scope', 'BookService', 'BookStatus', 'BookCategory', 'BookPosition', 
        function ($scope, BookService, BookStatus, BookCategory, BookPosition) {
    $scope.search = {};
    $scope.categoryList = angular.copy(BookCategory.list);
    $scope.statusList = angular.copy(BookStatus.list);
    $scope.positions = BookPosition.list;
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

    $scope.getBookCount = function (key, value) {
        console.log(key + ', ' + value);
        return BookService.getBookCount(key, value);
    };
}]);

bookControllers.controller('CreationController', ['$scope', 'BookService', 'BookCategory', 'BookPosition', 
        function ($scope, BookService, BookCategory, BookPosition) {
    var categories = angular.copy(BookCategory.list);
    categories.shift();
    $scope.categories = {
        categorySelect: null,
        list: categories
    };

    $scope.positions = {
        positionSelect: null,
        list: BookPosition.list
    };

    $scope.addBook = function () {
        var newBook = {
            title: $scope.title,
            author: $scope.author,
            category: parseInt($scope.categories.categorySelect),
            isbn: $scope.isbn,
            label: $scope.label,
            press: $scope.press,
            date: $scope.date,
            position: parseInt($scope.positions.positionSelect),
            status: parseInt($scope.status),
            stars: parseInt($scope.stars),
            cover: $scope.cover,
            notes: $scope.notes
        };

        console.log(newBook);
        console.log($('#cover').val());
        BookService.addBook(newBook);

        $scope.$state.go('books');
    };
}]);