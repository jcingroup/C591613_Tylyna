/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */
var d = new Date();
var n = d.getTime();
CKEDITOR.editorConfig = function (config) {
    // Define changes to default configuration here. For example:
    config.skin = 'bootstrapck';
    config.height = 285;
    config.language = 'zh';
    // config.uiColor = '#AADC6E';
    config.extraPlugins = 'youtube';
    //config.extraAllowedContent = 'ul(*);';
    config.contentsCss = ['../../Content/css/editor.css?v='+n];
    config.toolbar = [
        {
            name: "basicstyles",
            items: ["FontSize", "Bold", "Underline", "Strike", "-", "JustifyLeft", "JustifyCenter", "JustifyRight", "-", "RemoveFormat"]
        },
        { name: "colors", items: ["TextColor", "BGColor"] },
        { name: "paragraph", items: ["NumberedList", "BulletedList", "-", "Outdent", "Indent"] },
        // { name: "styles", items: ["Styles", "Format"] },
        { name: "styles", items: ["Styles"] },
        { name: "links", items: ["Link", "Unlink", "Anchor"] },'/',
        { name: 'insert', items: ['Image', 'Youtube', 'Table', 'Smiley', 'Iframe'] },
        {
            name: "clipboard",
            items: ["Cut", "Copy", "Paste", "PasteText", "PasteFromWord", "Undo", "Redo"]
        },
        { name: "document", items: ["Source", "-"] },
        { name: "tools", items: ["Maximize", "-"] },
        { name: "editing" }
    ];
    config.filebrowserBrowseUrl = "../../ckfinder/ckfinder.html";
    config.filebrowserImageBrowseUrl = "../../ckfinder/ckfinder.html?type=Images";
    config.filebrowserImageUploadUrl = "../../ckfinder/core/connector/aspx/connector.aspx?command=QuickUpload&type=Images";
    config.autoUpdateElement = true;

    //不要轉換htmltag
    config.allowedContent = true;
    config.fontSize_sizes = '13px/13px;14/14px;15/15px;16/16px;17/17px;18/18px;19/19px;20/20px;22/22px;24/24px;36/36px;48/48px;';
    config.font_names = 'Arial;Arial Black;Comic Sans MS;Courier New;Tahoma;Verdana;新細明體;細明體;標楷體;微軟正黑體';
};

CKEDITOR.stylesSet.add('default', [
    // Block Styles
    { name: '標題1', element: 'h2' },
    { name: '標題2', element: 'h3' },
    // { name: '標題3', element: 'h4' },
    { name: '標題3', element: 'h4', attributes: { 'class': 'sub-title' } },
    { name: '標題4', element: 'h5' },
    { name: '標題5', element: 'h6' },
    { name: '大段落', element: 'p', attributes: { 'class': 'leading' } },
    { name: '一般段落', element: 'p' },

    // Object Styles
    { name: '數字列表-無數字', element: 'ol', attributes: { 'class': 'list-unstyled' } },
    { name: '數字列表-底線', element: 'ol', attributes: { 'class': 'list-underline' } },
    { name: '數字列表-無數字有底線', element: 'ol', attributes: { 'class': 'list-unstyled list-underline' } },
    { name: '數字列表-中式數字', element: 'ol', attributes: { 'class': 'list-unstyled list-num' } },
    { name: '數字列表-中式數字有底線', element: 'ol', attributes: { 'class': 'list-unstyled list-num list-underline' } },
    { name: '數字列表-條款', element: 'ol', attributes: { 'class': 'list-unstyled list-indent list-underline' } },
    { name: '圖標列表-無圖標', element: 'ul', attributes: { 'class': 'list-unstyled' } },
    { name: '圖標列表-底線', element: 'ul', attributes: { 'class': 'list-underline' } },
    { name: '圖標列表-無圖標有底線', element: 'ul', attributes: { 'class': 'list-unstyled list-underline' } },
    { name: '圖標列表-條款', element: 'ul', attributes: { 'class': 'list-unstyled list-indent list-underline' } },
    { name: '表格-外框', element: 'table', attributes: { 'class': 'table-bordered table-hover' } },
    { name: '表格-強調內容', element: 'td', attributes: { 'class': 'item' } },
]);