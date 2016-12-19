import $ = require('jquery');
import * as Pom from 'es6-promise';
Pom.polyfill();
import 'whatwg-fetch';

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

export const callGet = (url: string, data: any): JQueryPromise<any> => {
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
export const callPost = (url: string, data: any): JQueryPromise<any> => {
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
        })

}
export const callPut = (url: string, data: any): JQueryPromise<any> => {
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
export const callDelete = (url: string, data: any): JQueryPromise<any> => {
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
}



export const fetchGet = (url: string, data: any): Promise<any> => {

    const url_param = EncodeQueryData(data);

    return fetch(url + (url_param == '' ? '' : '?' + url_param), {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
            'pragma': 'no-cache',
            'cache-control': 'no-cache'
        },
    }).then((response) => {
        return response.json();
    }).catch((reason) => {
        console.log(reason, url, data);
        alert('Call WebApi發生錯誤!');
    });
};
export const fetchPost = (url: string, data: any): Promise<any> => {

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
export const fetchPut = (url: string, data: any): Promise<any> => {

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
export const fetchDelete = (url: string, data: any): Promise<any> => {

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