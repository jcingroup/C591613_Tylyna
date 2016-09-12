﻿import $ = require('jquery');
import toastr = require('toastr');
import Moment = require('moment');

export function uniqid() {
    /*
        Autohr:Jerry
        Date:2014/2/23
        Description:取得唯一值
    */
    var newDate: Date = new Date(); return newDate.getTime();
}
function obj_prop_list(obj) {
    /*
    Autohr:Jerry
    Date:2014/2/23
    Description:列出物件屬性
    */
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            console.log(prop + " :" + obj[prop]);
        }
    }
}
function isValidJSONDate(value: string, userFormat) {
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
            if (/m/.test(format[i])) m = date[i];
            if (/d/.test(format[i])) d = date[i];
            if (/y/.test(format[i])) y = date[i];
        };
        return (
            m > 0 && m < 13 &&
            y && y.length === 4 &&
            d > 0 && d <= (new Date(y, m, 0)).getDate()
        )
    }

    return isDate(theDate, theFormat)
}
export function moneyFormat(n: number): string {
    /*
    Autohr:Ajoe
    Date:2015/12/09
    Description:金錢格式
    */
    let s = n.toString();
    return s.replace(/./g, function (c, i, a) {
        return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
    });

}
function obj_prop_date(obj: any) {

    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            var getUTCStr = obj[prop];
            if (typeof getUTCStr == 'string') {
                var isValid: boolean = isValidJSONDate(getUTCStr, null);
                if (isValid) {
                    obj[prop] = new Date(getUTCStr);
                }
            }
        }
    }

    return obj;
}
function stand_date(getDateStr: string) {
    var d = new Date(getDateStr);
    var r = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate;
    return r;
}
function getNowDate(): Date {
    var d: Date = new Date();
    var r: Date = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0)
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
    var d = new Date(); return d.toUTCString() + '.' + d.getMilliseconds().toString();
}
function pad(str: string, len: number, pad: string, dir: number) {

    var padlen: number;
    if (typeof (len) == "undefined") { var len = 0; }
    if (typeof (pad) == "undefined") { var pad = ' '; }
    if (typeof (dir) == "undefined") { var dir = 3; }

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
export function showAjaxError(data: any): void {
    alert('Ajax error,check console info!');
    console.log(data);
}
export var jqGet = function jqGet(url: string, data: any): JQueryXHR {
    return $.ajax({
        type: "GET",
        url: url,
        data: data,
        dataType: 'json',
        cache: false
    });
};
export function jqPost(url: string, data: any): JQueryXHR {
    return $.ajax({
        type: "POST",
        url: url,
        data: data,
        dataType: 'json',
        cache: false
    });
}
export function jqPut(url: string, data: any): JQueryXHR {
    return $.ajax({
        type: "PUT",
        url: url,
        data: data,
        dataType: 'json',
        cache: false
    });
};
export function jqDelete(url: string, data: any): JQueryXHR {
    return $.ajax({
        type: "DELETE",
        url: url,
        data: data,
        dataType: 'json',
        cache: false
    });
}
export function tosMessage(title: string, message: string, type: ToastrType) {

    if (type == ToastrType.info)
        toastr.info(message, title);

    if (type == ToastrType.success)
        toastr.success(message, title);

    if (type == ToastrType.error)
        toastr.error(message, title);

    if (type == ToastrType.warning)
        toastr.warning(message, title);
}
export function formatFileSize(byte_size: number): string {
    var get_size = byte_size;

    if (get_size <= 1024) {
        return get_size + 'Byte';
    } else if (get_size > 1024 && get_size <= 1024 * 1024) {
        var num = get_size / 1024;
        var fmt = Math.ceil(num);
        return fmt + 'KB';
    } else {
        var num = get_size / (1024 * 1024);
        var fmt = Math.ceil(num);
        return fmt + 'MB';
    }
}
export function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}
function getBrower() {
    var Sys: any = {};
    var ua = navigator.userAgent.toLowerCase();
    var s: any;
    (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
        (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
            (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
                (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
                    (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
                        (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;

    if (Sys.ie) return ('IE: ' + Sys.ie);
    if (Sys.firefox) return ('Firefox: ' + Sys.firefox);
    if (Sys.chrome) return ('Chrome: ' + Sys.chrome);
    if (Sys.opera) return ('Opera: ' + Sys.opera);
    if (Sys.safari) return ('Safari: ' + Sys.safari);
}
var replace_br: RegExp = /(?:\\[rn]|[\r\n]+)+/g; //將換行碼換成<br/>的樣板
function checkTwID(id) {
    /*
      Autohr:Ajoe
      Date:2015/9/8
      Description:台灣身份證檢查簡
    */
    if (id != null && id != "") {
        //建立字母分數陣列(A~Z)
        var city = new Array(
            1, 10, 19, 28, 37, 46, 55, 64, 39, 73, 82, 2, 11,
            20, 48, 29, 38, 47, 56, 65, 74, 83, 21, 3, 12, 30
        )
        id = id.toUpperCase();
        // 使用「正規表達式」檢驗格式
        if (id.search(/^[A-Z](1|2)\d{8}$/i) == -1) {
            //alert('基本格式錯誤');
            return false;
        } else {
            //將字串分割為陣列(IE必需這麼做才不會出錯)
            id = id.split('');
            //計算總分
            var total = city[id[0].charCodeAt(0) - 65];
            for (var i = 1; i <= 8; i++) {
                total += eval(id[i]) * (9 - i);
            }
            //補上檢查碼(最後一碼)
            total += eval(id[9]);
            //檢查比對碼(餘數應為0);
            return ((total % 10 == 0));
        }
    } else {
        return true;
    }
}
function DiffDate(start: string, end: string) {
    /*
      Autohr:Ajoe
      Date:2015/9/24
      Description:計算兩日期相差天數
    */
    if (start != null && end != null) {
        var day_s: Date = new Date(start);
        var day_e: Date = new Date(end);
        if (day_s <= day_e) {
            //開始日期 小於等於 結束日期 才計算
            var iDays: number = (Math.abs(day_e.getTime() - day_s.getTime()) / 1000 / 60 / 60 / 24) + 1;
            return { result: 1, diff_day: iDays };
        } else {
            return { result: -1, diff_day: 0 };
        }
    } else {
        return { result: -2, diff_day: 0 };
    }
}

export function MntV(date) {
    //將日期設定成moment物件
    var r = date === null || date === undefined ? null : Moment(date);
    return r;
}
export function formatNumber (number) {
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
export var Ajax = {
    /*
    Only javascript ajax call No JQuery
    Ajax.request("/hello-world/ajax","GET",null,function(data){
        console.log("Success");
    },function(){
        console.log("failed");
    },);
    */
    xhr: null,
    request: function (url: string, method: string, data: any, success: (response: string) => void, failure: (responseText: string) => void) {

        if (!this.xhr) {
            //this.xhr = window.ActiveX ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
            this.xhr = new XMLHttpRequest();
        }
        let self: XMLHttpRequest = this.xhr;
        self.onreadystatechange = function () {
            if (self.readyState === 4 && self.status === 200) {
                var response = JSON.parse(self.responseText);
                if (success != null)
                    success(response);
            } else if (self.readyState === 4) {
                if (failure != null)
                    failure(self.responseText);
            }
        };


        var parms = "?" + Object.keys(data).map(function (key) {
            return key + "=" + data[key]
        }).join("&");

        var send_url = url + parms;

        self.open(method, send_url, true);
        self.send();
    },
};