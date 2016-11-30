"use strict";
const $ = require('jquery');
const Pom = require('es6-promise');
Pom.polyfill();
require('whatwg-fetch');
function EncodeQueryData(data) {
    var ret = [];
    for (var d in data) {
        if (data[d] !== undefined && data[d] !== null && data[d] !== '')
            ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
        else
            ret.push(encodeURIComponent(d) + "=");
    }
    return ret.join("&");
}
exports.callGet = (url, data) => {
    return $.ajax({
        type: "GET",
        url: url,
        data: data,
        dataType: 'json',
        cache: false
    }).fail((jqXHR, textStatus, errorThrown) => {
        console.log(textStatus, errorThrown, url, data);
        alert('Call WebApi發生錯誤!');
    });
};
exports.callPost = (url, data) => {
    return $.ajax({
        type: "POST",
        url: url,
        data: data,
        dataType: 'json',
        cache: false
    })
        .fail((jqXHR, textStatus, errorThrown) => {
        console.log(textStatus, errorThrown, url, data);
        alert('Call WebApi發生錯誤!');
    });
};
exports.callPut = (url, data) => {
    return $.ajax({
        type: "PUT",
        url: url,
        data: data,
        dataType: 'json',
        cache: false
    }).fail((jqXHR, textStatus, errorThrown) => {
        console.log(textStatus, errorThrown, url, data);
        alert('Call WebApi發生錯誤!');
    });
};
exports.callDelete = (url, data) => {
    return $.ajax({
        type: "DELETE",
        url: url,
        data: data,
        dataType: 'json',
        cache: false
    }).fail((jqXHR, textStatus, errorThrown) => {
        console.log(textStatus, errorThrown, url, data);
        alert('Call WebApi發生錯誤!');
    });
};
exports.fetchGet = (url, data) => {
    const url_param = EncodeQueryData(data);
    return fetch(url + (url_param == '' ? '' : '?' + url_param), {
        method: 'GET',
        credentials: 'same-origin'
    }).then((response) => {
        return response.json();
    }).catch((reason) => {
        console.log(reason, url, data);
        alert('Call WebApi發生錯誤!');
    });
};
exports.fetchPost = (url, data) => {
    return fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then((response) => {
        return response.json();
    }).catch((reason) => {
        console.log(reason, url, data);
        alert('Call WebApi發生錯誤!');
    });
};
exports.fetchPut = (url, data) => {
    return fetch(url, {
        method: 'PUT',
        credentials: 'same-origin',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then((response) => {
        return response.json();
    }).catch((reason) => {
        console.log(reason, url, data);
        alert('Call WebApi發生錯誤!');
    });
};
exports.fetchDelete = (url, data) => {
    return fetch(url, {
        method: 'DELETE',
        credentials: 'same-origin',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then((response) => {
        return response.json();
    }).catch((reason) => {
        console.log(reason, url, data);
        alert('Call WebApi發生錯誤!');
    });
};
