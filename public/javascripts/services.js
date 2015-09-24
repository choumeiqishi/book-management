'use strict';

/* Services */

var bookServices = angular.module('bookServices', []);

bookServices.factory('BookService', [function(){
    var o = {
    	books: []
    };

    o.books = [
        {
            id: '1',
            name: '黄金时代',
            author: '王小波',
            category: '文学',
            isbn: 'WXB193321-3',
            label: '时代三部曲',
            press: '陕西师范大学',
            date: '2012-12-12',
            position: 'A-1',
            status: 2,
            stars: 5,
            cover: 'images/literature/huangjinshidai-wangxiaobo.jpg',
            notes: '看过多遍的一本小说'
        },
        {
            id: '2',
            name: '白银时代',
            author: '王小波',
            category: '文学',
            isbn: 'WXB193321-4',
            label: '时代三部曲',
            press: '陕西师范大学',
            date: '2012-12-12',
            position: 'A-1',
            status: 1,
            stars: 4,
            cover: 'images/literature/baiyinshidai-wangxiaobo.jpg',
            notes: '看过多遍的一本小说'
        },
        {
            id: '3',
            name: '青铜时代',
            author: '王小波',
            category: '文学',
            isbn: 'WXB193321-4',
            label: '时代三部曲',
            press: '陕西师范大学',
            date: '2012-12-12',
            position: 'A-1',
            status: 0,
            stars: 4,
            cover: 'images/literature/baiyinshidai-wangxiaobo.jpg',
            notes: '看过多遍的一本小说'
        }
    ];

    return o;
}]);
