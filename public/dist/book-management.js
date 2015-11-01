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

/* Controllers */

var bookControllers = angular.module('bookControllers', ['bookServices']);

// nav
bookControllers.controller('NavController', ['$scope', 'auth', function ($scope, auth) {
    $scope.isLoggedIn = auth.isLoggedIn;
    $scope.currentUser = auth.currentUser;
    $scope.logOut = auth.logOut;
}]);

// auth
bookControllers.controller('AuthController', ['$scope', '$state', 'auth', function ($scope, $state, auth) {
    $scope.user = {};

    $scope.register = function () {
        auth.register($scope.user).error(function (error) {
            $scope.error = error;
        }).then(function () {
            $state.go('books');
        });
    };

    $scope.logIn = function () {
        auth.logIn($scope.user).error(function (error) {
            $scope.error = error;
        }).then(function () {
            $state.go('books');
        });
    };
}]);

// book list controller
bookControllers.controller('ListController', ['$scope', 'BookService', 'BookStatus', 'BookCategory', 'BookPosition', 
        function ($scope, BookService, BookStatus, BookCategory, BookPosition) {
    $scope.search = {};
    $scope.categoryList = angular.copy(BookCategory.list);
    $scope.statusList = angular.copy(BookStatus.list);
    $scope.positions = BookPosition.list;
    $scope.orderField = 'category';
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

    $scope.orderBooks = function (field, clickEvent) {
        var currentTh = angular.element(clickEvent.target);

        // order field
        if (this.orderField === field) {
            this.orderField = '-' + field;
        } else {
            this.orderField = field;           
        }

        // th class
        if (currentTh.hasClass('headerSortDown')) {
            currentTh.removeClass('headerSortDown').addClass('headerSortUp');
        } else if (currentTh.hasClass('headerSortUp')) {
            currentTh.removeClass('headerSortUp').addClass('headerSortDown');
        } else {
            currentTh.parent().children().removeClass('headerSortDown').removeClass('headerSortUp');
            currentTh.addClass('headerSortDown');
        }
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

// book statistics controller
bookControllers.controller('StatisticsController', ['$scope', 'BookService', 'BookCategory', 'BookStatus', 
        function ($scope, BookService, BookCategory, BookStatus) {

    // category
    var categories = angular.copy(BookCategory.list);
    categories.shift();
    var categoryLabels = [];
    var categoryPieData = [];
    angular.forEach(categories, function(item) {
        categoryLabels.push(item.label);
        var obj = {
            name: item.label,
            value: BookService.getBookCount('category', item.value)
        };
        categoryPieData.push(obj);
    });

    // line data
    var books = BookService.books;
    var counts = {
        status1: [],
        status2: [],
        status3: [],
        all: [],
        stars3: [],
        stars4: [],
        stars5: []
    };
    
    for (var i=0; i<categories.length; i++) {
        counts.status1.push(BookService.getCountByConditions('category', categories[i].value, 'status', 1));
        counts.status2.push(BookService.getCountByConditions('category', categories[i].value, 'status', 2));
        counts.status3.push(BookService.getCountByConditions('category', categories[i].value, 'status', 3));
        counts.all.push(BookService.getBookCount('category', categories[i].value));
        counts.stars3.push(BookService.getCountByConditions('category', categories[i].value, 'stars', 3));
        counts.stars4.push(BookService.getCountByConditions('category', categories[i].value, 'stars', 4));
        counts.stars5.push(BookService.getCountByConditions('category', categories[i].value, 'stars', 5));
    }

    $scope.drawFullLineChart = function () {
        require.config({paths: {echarts: '/libs/echarts'}});
        require(
            [
                'echarts',
                'echarts/chart/bar'
            ],
            function (ec) {
                var myChart = ec.init(document.getElementById('fullLineChart'));
                myChart.setOption({
                    title : {
                        text: '左图右书完全统计',
                        textStyle: {fontSize: 14 },
                        x:'center'
                    },
                    legend: {
                        x: 'center',
                        y: 'bottom',
                        data: ['未读', '正读', '已读', '全部', '三星', '四星', '五星']
                    },
                    tooltip : {
                        trigger: 'axis',
                        textStyle: {fontSize: 12},
                        axisPointer : {type : 'shadow'}
                    },
                    grid: {
                        y: 48,
                        y2: 80,
                        x2: 10,
                        borderColor: '#eee'
                    },
                    color: ['#33dd00', '#33bb00', '#339900', '#99CC00', '#ffcc00', '#ff9900', '#ff6600'],
                    xAxis : [
                        {
                            type : 'category',
                            axisLine : {lineStyle:{width: 0}},
                            axisTick: {show: false},
                            splitLine: {lineStyle: {color: ['#eee']}},
                            data : categoryLabels
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            axisLine : {lineStyle:{width: 0}},
                            splitLine: {lineStyle: {color: ['#eee']}}
                        }
                    ],
                    series : [
                        {
                            name:'未读',
                            type:'bar',
                            itemStyle: {normal: {barBorderRadius: 2}},
                            stack: '状态',
                            data: counts.status1
                        },
                        {
                            name:'正读',
                            type:'bar',
                            itemStyle: {normal: {barBorderRadius: 2}},
                            stack: '状态',
                            data: counts.status2
                        },
                        {
                            name:'已读',
                            type:'bar',
                            itemStyle: {normal: {barBorderRadius: 2}},
                            stack: '状态',
                            data: counts.status3
                        },                       
                        {
                            name:'全部',
                            type:'bar',
                            itemStyle: {normal: {barBorderRadius: 2}},
                            data: counts.all,
                            markLine : {
                                itemStyle:{
                                    normal:{
                                        lineStyle:{
                                            type: 'dashed'
                                        }
                                    }
                                },
                                data : [
                                    [{type : 'min'}, {type : 'max'}]
                                ]
                            }
                        },
                        {
                            name:'三星',
                            type:'bar',
                            itemStyle: {normal: {barBorderRadius: 2}},
                            stack: '评价',
                            data: counts.stars3
                        },
                        {
                            name:'四星',
                            type:'bar',
                            itemStyle: {normal: {barBorderRadius: 2}},
                            stack: '评价',
                            data: counts.stars4
                        },
                        {
                            name:'五星',
                            itemStyle: {normal: {barBorderRadius: 2}},
                            type:'bar',
                            stack: '评价',
                            data: counts.stars5
                        }
                    ]
                });
            }
        );
    };

    $scope.drawPieChart = function (params) {
        require.config({paths: {echarts: '/libs/echarts'}});
        require(
            [
                'echarts',
                'echarts/chart/pie'
            ],
            function (ec) {
                var myChart = ec.init(document.getElementById(params.container));
                myChart.setOption({
                    title : {
                        text: params.title,
                        textStyle: {fontSize: 14 },
                        x:'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        textStyle: {fontSize: 12},
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    color: params.color,
                    series : [
                        {
                            name:'左图右书',
                            type:'pie',
                            radius : ['50%', '80%'],
                            center: ['50%', '60%'],
                            itemStyle : {
                                normal : {
                                    label : {show : false},
                                    labelLine : {show : false}
                                },
                                emphasis : {
                                    label : {
                                        show : true,
                                        position : 'center',
                                        textStyle : {
                                            fontSize : '12',
                                            fontWeight : 'bold'
                                        }
                                    }
                                }
                            },
                            data: params.data
                        }
                    ]
                });
            }
        );
    };

    // full line chart
    $scope.drawFullLineChart();

    // category pie chart
    var categoryParams = {
        container: 'categoryPieChart',
        title: '类别',
        color: ['#336666', '#99CC00'],
        data: categoryPieData
    };
    $scope.drawPieChart(categoryParams);

    // status pie chart
    var statusParams = {
        container: 'statusPieChart',
        title: '状态',
        color: ['#339900', '#33bb00',  '#33dd00'],
        data: [
            {name: '已读', value: BookService.getBookCount('status', 3)},
            {name: '正读', value: BookService.getBookCount('status', 2)},
            {name: '未读', value: BookService.getBookCount('status', 1)}
        ]
    };
    $scope.drawPieChart(statusParams);

    // stars pie chart
    var starsParams = {
        container: 'starsPieChart',
        title: '评价',
        color: ['#ffcc00', '#ff9900', '#ff6600'],
        data: [
            {name: '三星', value: BookService.getBookCount('stars', 3)},
            {name: '四星', value: BookService.getBookCount('stars', 4)},
            {name: '五星', value: BookService.getBookCount('stars', 5)}
        ]
    };
    $scope.drawPieChart(starsParams);
}]);

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
        if (auth.isLoggedIn) {
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

bookServices.factory('BookService', ['$http', function($http){
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
    	return $http.post('/books', book).success(function (data) {
            o.books.push(data);
        });
    };

    o.updateBook = function (book) {
        return $http.put('/books/' + book._id, book).then(function (res) {
            return res.data;
        });
    };

    o.removeBook = function (bookId) {
        return $http.delete('/books/' + bookId).then(function (res) {
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
