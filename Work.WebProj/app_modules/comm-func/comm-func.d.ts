﻿declare module "comm-func" {
    function uniqid();
    function showAjaxError(data: any): void
    function jqGet(url: string, data: any): JQueryXHR
    function jqPost(url: string, data: any): JQueryXHR
    function jqPut(url: string, data: any): JQueryXHR
    function jqDelete(url: string, data: any): JQueryXHR
    function tosMessage(title: string, message: string, type: ToastrType)
    function formatFileSize(byte_size: number): string
    function moneyFormat(n: number): string
    function clone(obj)
    function MntV(date: any): moment.Moment
    function formatNumber(number: number): string
    var Ajax: {
        xhr: XMLHttpRequest,
        request(url: string, method: string, data: any, success: (response: any) => void, failure: (responseText: string) => void)
    }
}