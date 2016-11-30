"use strict";
const $ = require('jquery');
const toastr = require('toastr');
const Moment = require('moment');
function uniqid() {
    var newDate = new Date();
    return newDate.getTime();
}
exports.uniqid = uniqid;
function obj_prop_list(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            console.log(prop + " :" + obj[prop]);
        }
    }
}
function isValidJSONDate(value, userFormat) {
    var userFormat = userFormat || 'yyyy-mm-dd';
    var delimiter = /[^mdy]/.exec(userFormat)[0];
    var theFormat = userFormat.split(delimiter);
    var splitDatePart = value.split('T');
    if (splitDatePart.length == 1)
        return false;
    var theDate = splitDatePart[0].split(delimiter);
    var isDate = function (date, format) {
        var m, d, y;
        for (var i = 0, len = format.length; i < len; i++) {
            if (/m/.test(format[i]))
                m = date[i];
            if (/d/.test(format[i]))
                d = date[i];
            if (/y/.test(format[i]))
                y = date[i];
        }
        ;
        return (m > 0 && m < 13 &&
            y && y.length === 4 &&
            d > 0 && d <= (new Date(y, m, 0)).getDate());
    };
    return isDate(theDate, theFormat);
}
exports.isValidJSONDate = isValidJSONDate;
function fmt_money(n, g) {
    if (n == undefined || n == null)
        return '';
    let glue = (typeof g == 'string' && g != null && g != undefined) ? g : ',';
    let digits = n.toString().split('.');
    let pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(digits[0])) {
        digits[0] = digits[0].replace(pattern, "$1" + glue + "$2");
    }
    return digits.join(".");
}
exports.fmt_money = fmt_money;
function obj_prop_date(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            var getUTCStr = obj[prop];
            if (typeof getUTCStr == 'string') {
                var isValid = isValidJSONDate(getUTCStr, null);
                if (isValid) {
                    obj[prop] = new Date(getUTCStr);
                }
            }
        }
    }
    return obj;
}
function stand_date(getDateStr) {
    var d = new Date(getDateStr);
    var r = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate;
    return r;
}
function getNowDate() {
    var d = new Date();
    var r = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
    return r;
}
function month_first_day() {
    var d = new Date();
    var r = new Date(d.getFullYear(), d.getMonth(), 1);
    return r;
}
function month_last_day() {
    var d = new Date();
    var r = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    return r;
}
function tim() {
    var d = new Date();
    return d.toUTCString() + '.' + d.getMilliseconds().toString();
}
exports.tim = tim;
function pad(str, len, pad, dir) {
    var padlen;
    if (typeof (len) == "undefined") {
        var len = 0;
    }
    if (typeof (pad) == "undefined") {
        var pad = ' ';
    }
    if (typeof (dir) == "undefined") {
        var dir = 3;
    }
    if (len + 1 >= str.length) {
        switch (dir) {
            case 1:
                str = Array(len + 1 - str.length).join(pad) + str;
                break;
            case 2:
                str = str + Array(len + 1 - str.length).join(pad);
                break;
            case 3:
                var right = Math.ceil((padlen = len - str.length) / 2);
                var left = padlen - right;
                str = Array(left + 1).join(pad) + str + Array(right + 1).join(pad);
                break;
        }
    }
    return str;
}
exports.pad = pad;
function showAjaxError(data) {
    alert('Ajax error,check console info!');
    console.log(data);
}
exports.showAjaxError = showAjaxError;
function tosMessage(title, message, type) {
    if (type == 0)
        toastr.info(message, title);
    if (type == 1)
        toastr.success(message, title);
    if (type == 3)
        toastr.error(message, title);
    if (type == 2)
        toastr.warning(message, title);
}
exports.tosMessage = tosMessage;
function formatFileSize(byte_size) {
    var get_size = byte_size;
    if (get_size <= 1024) {
        return get_size + 'Byte';
    }
    else if (get_size > 1024 && get_size <= 1024 * 1024) {
        var num = get_size / 1024;
        var fmt = Math.ceil(num);
        return fmt + 'KB';
    }
    else {
        var num = get_size / (1024 * 1024);
        var fmt = Math.ceil(num);
        return fmt + 'MB';
    }
}
exports.formatFileSize = formatFileSize;
function clone(obj) {
    if (null == obj || "object" != typeof obj)
        return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr))
            copy[attr] = obj[attr];
    }
    return copy;
}
exports.clone = clone;
function getBrower() {
    var Sys = {};
    var ua = navigator.userAgent.toLowerCase();
    var s;
    (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
        (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
            (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
                (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
                    (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
                        (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
    if (Sys.ie)
        return ('IE: ' + Sys.ie);
    if (Sys.firefox)
        return ('Firefox: ' + Sys.firefox);
    if (Sys.chrome)
        return ('Chrome: ' + Sys.chrome);
    if (Sys.opera)
        return ('Opera: ' + Sys.opera);
    if (Sys.safari)
        return ('Safari: ' + Sys.safari);
}
var replace_br = /(?:\\[rn]|[\r\n]+)+/g;
function checkTwID(id) {
    if (id != null && id != "") {
        var city = new Array(1, 10, 19, 28, 37, 46, 55, 64, 39, 73, 82, 2, 11, 20, 48, 29, 38, 47, 56, 65, 74, 83, 21, 3, 12, 30);
        id = id.toUpperCase();
        if (id.search(/^[A-Z](1|2)\d{8}$/i) == -1) {
            return false;
        }
        else {
            id = id.split('');
            var total = city[id[0].charCodeAt(0) - 65];
            for (var i = 1; i <= 8; i++) {
                total += eval(id[i]) * (9 - i);
            }
            total += eval(id[9]);
            return ((total % 10 == 0));
        }
    }
    else {
        return true;
    }
}
function DiffDate(start, end) {
    if (start != null && end != null) {
        var day_s = new Date(start);
        var day_e = new Date(end);
        if (day_s <= day_e) {
            var iDays = (Math.abs(day_e.getTime() - day_s.getTime()) / 1000 / 60 / 60 / 24) + 1;
            return { result: 1, diff_day: iDays };
        }
        else {
            return { result: -1, diff_day: 0 };
        }
    }
    else {
        return { result: -2, diff_day: 0 };
    }
}
function MntV(date) {
    var r = date === null || date === undefined ? null : Moment(date);
    return r;
}
exports.MntV = MntV;
function formatNumber(number) {
    if (number == undefined || number == null) {
        return '';
    }
    var snumber = number.toFixed(2) + '';
    var x = snumber.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1;
}
exports.formatNumber = formatNumber;
exports.Ajax = {
    xhr: null,
    request: function (url, method, data, success, failure) {
        if (!this.xhr) {
            this.xhr = new XMLHttpRequest();
        }
        let self = this.xhr;
        self.onreadystatechange = function () {
            if (self.readyState === 4 && self.status === 200) {
                var response = JSON.parse(self.responseText);
                if (success != null)
                    success(response);
            }
            else if (self.readyState === 4) {
                if (failure != null)
                    failure(self.responseText);
            }
        };
        var parms = "?" + Object.keys(data).map(function (key) {
            return key + "=" + data[key];
        }).join("&");
        var send_url = url + parms;
        self.open(method, send_url, true);
        self.send();
    },
};
function makeInputValue(e) {
    let input = e.target;
    let value;
    if (input.value == 'true') {
        value = true;
    }
    else if (input.value == 'false') {
        value = false;
    }
    else {
        value = input.value;
    }
    return value;
}
exports.makeInputValue = makeInputValue;
function ifrmDown(download_src) {
    $('#file_down').remove();
    var item = $(this).attr('item');
    var src = src;
    var encSrc = download_src;
    var ifram = $('<iframe id="file_down" style="display:none">');
    ifram.attr('src', encSrc);
    $(document.body).append(ifram);
}
exports.ifrmDown = ifrmDown;
function isNumeric(n) {
    let m = parseFloat(n);
    return !isNaN(parseFloat(n)) && isFinite(n);
}
exports.isNumeric = isNumeric;
function htmlbr(val, g) {
    if (val == undefined || val == null)
        return '';
    let glue = (typeof g == 'string' && g != null && g != undefined) ? g : '<br />';
    return val.replace(/(?:\r\n|\r|\n)/g, glue);
}
exports.htmlbr = htmlbr;
