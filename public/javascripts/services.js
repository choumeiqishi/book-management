'use strict';

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

bookServices.factory('BookService', [function(){
    var o = {
    	books: []
    };

    o.books = [
        {
            id: '1',
            title: '黄金时代',
            author: '王小波',
            category: 1,
            isbn: 'WXB193321-3',
            label: '时代三部曲',
            press: '陕西师范大学',
            date: '2012-12-12',
            position: 1,
            status: 3,
            stars: 5,
            cover: 'images/literature/huangjinshidai-wangxiaobo.jpg',
            notes: '看过多遍的一本小说'
        },
        {
            id: '2',
            title: '白银时代',
            author: '李银河',
            category: 2,
            isbn: 'WXB193321-4',
            label: '时代',
            press: '陕西师范大学',
            date: '2012-12-12',
            position: 2,
            status: 2,
            stars: 4,
            cover: 'images/literature/baiyinshidai-wangxiaobo.jpg',
            notes: '看过多遍的一本小说'
        },
        {
            id: '3',
            title: '青铜时代',
            author: '王小波',
            category: 3,
            isbn: 'WXB193321-4',
            label: '时代四部曲',
            press: '陕西理工大学',
            date: '2012-12-12',
            position: 3,
            status: 1,
            stars: 4,
            cover: 'images/literature/baiyinshidai-wangxiaobo.jpg',
            notes: '看过多遍的一本小说'
        },
        {
            id: '4',
            title: '黑铁时代',
            author: '王小波',
            category: 3,
            isbn: 'WXB193321-4',
            label: '时代四部曲',
            press: '陕西理工大学',
            date: '2012-12-12',
            position: 3,
            status: 1,
            stars: 4,
            cover: 'images/literature/baiyinshidai-wangxiaobo.jpg',
            notes: '看过多遍的一本小说'
        }
    ];

    o.addBook = function (book) {
    	this.books.push(book);
    };

    return o;
}]);
