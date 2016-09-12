import $ = require('jquery');

export const callGet = (url: string, data: any): JQueryXHR => {
    return $.ajax({
        type: "GET",
        url: url,
        data: data,
        dataType: 'json',
        cache: false
    });
};
export const callPost = (url: string, data: any): JQueryXHR => {
    return $.ajax({
        type: "POST",
        url: url,
        data: data,
        dataType: 'json',
        cache: false
    });
}
export const callPut = (url: string, data: any): JQueryXHR => {
    return $.ajax({
        type: "PUT",
        url: url,
        data: data,
        dataType: 'json',
        cache: false
    });
};
export const callDelete = (url: string, data: any): JQueryXHR => {
    return $.ajax({
        type: "DELETE",
        url: url,
        data: data,
        dataType: 'json',
        cache: false
    });
}