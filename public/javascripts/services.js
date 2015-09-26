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

bookServices.factory('BookService', [function(){
    var o = {
    	books: []
    };

    o.books = [
        {
            id: '1',
            name: '黄金时代',
            author: '王小波',
            category: 1,
            isbn: 'WXB193321-3',
            label: '时代三部曲',
            press: '陕西师范大学',
            date: '2012-12-12',
            position: 'A-1',
            status: 3,
            stars: 5,
            cover: 'images/literature/huangjinshidai-wangxiaobo.jpg',
            notes: '看过多遍的一本小说'
        },
        {
            id: '2',
            name: '白银时代',
            author: '王小波',
            category: 2,
            isbn: 'WXB193321-4',
            label: '时代三部曲',
            press: '陕西师范大学',
            date: '2012-12-12',
            position: 'A-1',
            status: 2,
            stars: 4,
            cover: 'images/literature/baiyinshidai-wangxiaobo.jpg',
            notes: '看过多遍的一本小说'
        },
        {
            id: '3',
            name: '青铜时代',
            author: '王小波',
            category: 3,
            isbn: 'WXB193321-4',
            label: '时代三部曲',
            press: '陕西师范大学',
            date: '2012-12-12',
            position: 'A-1',
            status: 1,
            stars: 4,
            cover: 'images/literature/baiyinshidai-wangxiaobo.jpg',
            notes: '看过多遍的一本小说'
        }
    ];

    return o;
}]);
