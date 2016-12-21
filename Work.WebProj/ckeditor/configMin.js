/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */
var d = new Date();
var n = d.getTime();
CKEDITOR.editorConfig = function (config) {
    // Define changes to default configuration here. For example:
    config.skin = 'bootstrapck';
    config.height = 300;
    config.language = 'zh';
    config.contentsCss = ['../../Content/css/editor.css?v='+n];
    config.toolbar = [
        {
            name: "basicstyles",
            items: ["FontSize", "Bold", "Underline", "Strike", "-", "RemoveFormat"]
        },
        { name: "colors", items: ["TextColor", "BGColor"] },
        { name: "paragraph", items: ["NumberedList", "BulletedList", "-", "Outdent", "Indent"] },
        { name: "styles", items: ["Styles"] },
        { name: "links", items: ["Link", "Unlink"] },
        {
            name: "clipboard",
            items: ["Cut", "Copy", "Paste", "PasteFromWord", "Undo", "Redo"]
        },
        { name: "document", items: ["Source", "-"] },
        { name: "tools", items: ["Maximize", "-"] },
        { name: "editing" }
    ];
    // config.filebrowserBrowseUrl = "../../ckfinder/ckfinder.html";
    // config.filebrowserImageBrowseUrl = "../../ckfinder/ckfinder.html?type=Images";
    // config.filebrowserImageUploadUrl = "../../ckfinder/core/connector/aspx/connector.aspx?command=QuickUpload&type=Images";
    // config.autoUpdateElement = true;

    //不要轉換htmltag
    config.allowedContent = true;
    config.fontSize_sizes = '14/14px;15/15px;16/16px;17/17px;18/18px';
    config.font_names = 'Arial;Arial Black;Comic Sans MS;Courier New;Tahoma;Verdana;微軟正黑體';

    // 本次專案用樣式
    config.stylesSet = [
        // Object Styles
        { name: '數字列表-有數字', element: 'ol', attributes: { 'class': 'm-l-24' } },
        { name: '數字列表-無數字', element: 'ol', attributes: { 'class': 'list-unstyled m-l-24' } },
        { name: '圖標列表-有圖標', element: 'ul', attributes: { 'class': 'm-l-24' } },
        { name: '圖標列表-無圖標', element: 'ul', attributes: { 'class': 'list-unstyled m-l-24' } }
    ];
};