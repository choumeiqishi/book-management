'use strict';

/* Controllers */

var bookControllers = angular.module('bookControllers', ['bookServices']);

// book list controller
bookControllers.controller('ListController', ['$scope', 'BookService', 'BookStatus', 'BookCategory', 'BookPosition', 
        function ($scope, BookService, BookStatus, BookCategory, BookPosition) {
    $scope.search = {};
    $scope.categoryList = angular.copy(BookCategory.list);
    $scope.statusList = angular.copy(BookStatus.list);
    $scope.positions = BookPosition.list;
    $scope.books = BookService.books;
    
    $scope.filterCategory = function (category) {
        $scope.strict = true;
        $scope.search.$ = undefined;

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
        $scope.strict = true;
        $scope.search.$ = undefined;

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
        return BookService.getBookCount(key, value);
    };
}]);

// book detail controller
bookControllers.controller('DetailController', ['$scope', '$stateParams', 'BookService', 'BookCategory', 'BookPosition', 'book',  
        function ($scope, $stateParams, BookService, BookCategory, BookPosition, book) {

    $scope.book = book;
    $scope.book.date = new Date($scope.book.date);

    var categories = angular.copy(BookCategory.list);
    categories.shift();

    $scope.categories = {
        categorySelect: $scope.book.category + '',
        list: categories
    };

    $scope.positions = {
        positionSelect: $scope.book.position + '',
        list: BookPosition.list
    };

    // update book
    $scope.updateBook = function () {
        $scope.book.category = parseInt($scope.categories.categorySelect);
        $scope.book.position = parseInt($scope.positions.positionSelect);
        BookService.updateBook($scope.book);
        $scope.$state.go('books');
    };

    // remove a book
    $scope.removeBook = function () {
        BookService.removeBook($scope.book._id);
        $scope.$state.go('books');
    };
}]);

// book creation controller
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

    $scope.date = new Date();
    $scope.status = 1;

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
            notes: $scope.notes
        };

        BookService.createBook(newBook);

        $scope.$state.go('books');
    };
}]);