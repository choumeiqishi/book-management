/* Controllers */

var bookControllers = angular.module('bookControllers', ['bookServices']);

// nav
bookControllers.controller('NavController', ['$scope', 'auth', function ($scope, auth) {
    console.log('username='+auth.currentUser);
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
