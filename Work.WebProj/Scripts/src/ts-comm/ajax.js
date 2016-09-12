"use strict";
var $ = require('jquery');
exports.callGet = function (url, data) {
    return $.ajax({
        type: "GET",
        url: url,
        data: data,
        dataType: 'json',
        cache: false
    });
};
exports.callPost = function (url, data) {
    return $.ajax({
        type: "POST",
        url: url,
        data: data,
        dataType: 'json',
        cache: false
    });
};
exports.callPut = function (url, data) {
    return $.ajax({
        type: "PUT",
        url: url,
        data: data,
        dataType: 'json',
        cache: false
    });
};
exports.callDelete = function (url, data) {
    return $.ajax({
        type: "DELETE",
        url: url,
        data: data,
        dataType: 'json',
        cache: false
    });
};
