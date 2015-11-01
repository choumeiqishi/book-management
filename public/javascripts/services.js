/* Services */

var bookServices = angular.module('bookServices', []);

bookServices.value('BookCategory', {
	list: [
		{label: '全部', value: 0, selected: true},
		{label: '文学', value: 1},
		{label: '少儿', value: 2},
		{label: '教育', value: 3},
		{label: '管理', value: 4},
		{label: '励志与成功', value: 5},
		{label: '人文社科', value: 6},
		{label: '生活', value: 7},
		{label: '艺术', value: 8},
		{label: '科技', value: 9},
		{label: '计算机与互联网', value: 10}
	]
});

bookServices.value('BookStatus', {
	list: [
		{label: '全部', value: 0, selected: true}, 
        {label: '待购', value: 4},
		{label: '已读', value: 3}, 
		{label: '正读', value: 2},
		{label: '未读', value: 1}
	]
});

bookServices.value('BookPosition', {
	list: [
		{label: '6-1', value: 1},
		{label: '6-2', value: 2},
		{label: '6-3', value: 3},
		{label: '6-4', value: 4},
		{label: '5-1', value: 5},
		{label: '5-2', value: 6},
		{label: '5-3', value: 7},
		{label: '5-4', value: 8},
		{label: '4-1', value: 9},
		{label: '4-2', value: 10},
		{label: '4-3', value: 11},
		{label: '4-4', value: 12},
		{label: '3-1', value: 13},
		{label: '3-2', value: 14},
		{label: '2-1', value: 15},
		{label: '2-2', value: 16},
		{label: '1-1', value: 17},
		{label: '1-2', value: 18}
	]
});

bookServices.factory('auth', ['$http', '$window', function ($http, $window) {
    var auth = {};

    auth.saveToken = function (token) {
        $window.localStorage['ztys-token'] = token;
    };

    auth.getToken = function () {
        return $window.localStorage['ztys-token'];
    };

    auth.isLoggedIn = function () {
        var token = auth.getToken();

        if (token) {
            var payload = JSON.parse($window.atob(token.split('.')[1]));

            return payload.exp > Date.now() / 1000;
        } else {
            return false;
        }
    };

    auth.currentUser = function () {
        
        if (auth.isLoggedIn()) {
            var token  = auth.getToken();
            var payload = JSON.parse($window.atob(token.split('.')[1]));
            
            return payload.username;
        }
    };

    auth.register = function (user) {
        return $http.post('/register', user).success(function (data) {
            auth.saveToken(data.token);
        });
    };

    auth.logIn = function (user) {
        return $http.post('/login', user).success(function (data) {
            auth.saveToken(data.token);
        });
    };

    auth.logOut = function () {
        $window.localStorage.removeItem('ztys-token');
    };

    return auth;
}]);

bookServices.factory('BookService', ['$http', 'auth', function ($http, auth) {
    var o = {
    	books: []
    };

    o.getAllBooks = function () {
        return $http.get('/books').success(function (data) {
            angular.copy(data, o.books);
        });
    };

    o.getBook = function (bookId) {
        return $http.get('/books/' + bookId).then(function(res){
            return res.data;
        });
    };

    o.createBook = function (book) {
    	return $http.post('/books', book, {
            headers: {Authorization: 'Bearer ' + auth.getToken()}
        }).success(function (data) {
            o.books.push(data);
        });
    };

    o.updateBook = function (book) {
        return $http.put('/books/' + book._id, book, {
            headers: {Authorization: 'Bearer ' + auth.getToken()}
        }).then(function (res) {
            return res.data;
        });
    };

    o.removeBook = function (bookId) {
        return $http.delete('/books/' + bookId, null, {
            headers: {Authorization: 'Bearer ' + auth.getToken()}
        }).then(function (res) {
            console.log(res.data);
            return res.data;
        });
    };

    // get book count by catetory or status
    o.getBookCount = function (key, value) {
        if (value === 0) {
            return this.books.length;
        }
        var count = 0;
        for (var i=0; i<this.books.length; i++) {
            if (this.books[i][key] === value) {
                count += 1;
            }
        }
        return count;
    };

    // get count statistics by two conditions
    o.getCountByConditions = function (k1, v1, k2, v2) {
        var count = 0;

        for (var i=0; i<this.books.length; i++) {
            
            if (this.books[i][k1] === v1 && this.books[i][k2] === v2) {
                count += 1;
            }
        }
        return count;
    };

    // count
    o.getCount = function (query) {
        if (query) {
            return $http.post('/bookcount/', query).then(function(res){
                return res.data;
            });
        }
    };

    return o;
}]);
